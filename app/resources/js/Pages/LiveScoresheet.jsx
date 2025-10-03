import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Trophy, Users, Clock, Play, Pause, RotateCcw, 
    Plus, Minus, Undo2, Timer, AlertCircle 
} from 'lucide-react';

export default function LiveScoresheet({ auth, games, leagues, allTeams, selectedGame, gameState: initialGameState, userRole, flash }) {
    const [gameState, setGameState] = useState(initialGameState || {
        quarter: 1,
        time_remaining: 12 * 60,
        is_running: false,
        team_a_score: 0,
        team_b_score: 0,
        team_a_fouls: 0,
        team_b_fouls: 0,    
        team_a_timeouts: 2,
        team_b_timeouts: 2,
        total_quarters: 4,
        minutes_per_quarter: 12,
        timeouts_per_quarter: 2
    });

    const [selectedGameId, setSelectedGameId] = useState(selectedGame?.id || '');
    const [localPlayerStats, setLocalPlayerStats] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activePlayers, setActivePlayers] = useState({});
    const [substitutions, setSubstitutions] = useState([]);
    const [showSubDialog, setShowSubDialog] = useState(false);
    const [selectedTeamForSub, setSelectedTeamForSub] = useState('');
    const [playerOut, setPlayerOut] = useState('');
    const [playerIn, setPlayerIn] = useState('');
    const [multipleSubstitutions, setMultipleSubstitutions] = useState([]);
    const [isMultipleSubMode, setIsMultipleSubMode] = useState(false);
    const [showSubTeamSelect, setShowSubTeamSelect] = useState(false);
    const [showActivePlayersModal, setShowActivePlayersModal] = useState(false);
    const [activePlayersTeamId, setActivePlayersTeamId] = useState('');
    const [actionHistory, setActionHistory] = useState({});
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedSeason, setSelectedSeason] = useState('');
    const [showNeedsScoringOnly, setShowNeedsScoringOnly] = useState(true);
    const [showCreateMatchup, setShowCreateMatchup] = useState(false);
    const [matchupForm, setMatchupForm] = useState({
        league_id: '',
        team_a_id: '',
        team_b_id: '',
        date: '',
        venue: ''
    });
    const [isCreatingMatchup, setIsCreatingMatchup] = useState(false);
    const [showEditMatchup, setShowEditMatchup] = useState(false);
    const [showGameRules, setShowGameRules] = useState(false);
    const [gameRules, setGameRules] = useState({
        total_quarters: 4,
        minutes_per_quarter: 12,
        timeouts_per_quarter: 2
    });
    const [editMatchupForm, setEditMatchupForm] = useState({
        league_id: '',
        team_a_id: '',
        team_b_id: '',
        date: '',
        venue: ''
    });

    // Initialize local stats and active players from server data
    useEffect(() => {
        if (selectedGame?.player_stats) {
            const statsMap = {};
            selectedGame.player_stats.forEach(stat => {
                statsMap[stat.player_id] = { ...stat };
            });
            setLocalPlayerStats(statsMap);
        }
        
        // Initialize active players from server data or set initial starters
        if (selectedGame?.team_a?.players && selectedGame?.team_b?.players) {
            setActivePlayers(prev => {
                const newActivePlayers = { ...prev };
                
                console.log('Initializing active players:', {
                    selectedGameId: selectedGame.id,
                    teamAActiveFromServer: initialGameState?.team_a_active_players,
                    teamBActiveFromServer: initialGameState?.team_b_active_players,
                    currentActivePlayers: prev
                });
                
                // Always use server data if available (to handle page reloads properly)
                if (initialGameState?.team_a_active_players && initialGameState?.team_a_active_players.length > 0) {
                    newActivePlayers[selectedGame.team_a_id] = initialGameState.team_a_active_players;
                    console.log('Using server data for team A:', initialGameState.team_a_active_players);
                }
                if (initialGameState?.team_b_active_players && initialGameState?.team_b_active_players.length > 0) {
                    newActivePlayers[selectedGame.team_b_id] = initialGameState.team_b_active_players;
                    console.log('Using server data for team B:', initialGameState.team_b_active_players);
                }
                
                // Only set initial starters if no server data and no current data
                if (!newActivePlayers[selectedGame.team_a_id]) {
                    const teamAStarters = selectedGame.team_a.players.slice(0, 5).map(p => p.user?.id || p.id);
                    newActivePlayers[selectedGame.team_a_id] = teamAStarters;
                    console.log('Setting initial starters for team A:', teamAStarters);
                }
                if (!newActivePlayers[selectedGame.team_b_id]) {
                    const teamBStarters = selectedGame.team_b.players.slice(0, 5).map(p => p.user?.id || p.id);
                    newActivePlayers[selectedGame.team_b_id] = teamBStarters;
                    console.log('Setting initial starters for team B:', teamBStarters);
                }
                
                return newActivePlayers;
            });
        }
    }, [selectedGame]);

    // Timer effect
    useEffect(() => {
        let interval;
        if (gameState.is_running && gameState.time_remaining > 0) {
            interval = setInterval(() => {
                setGameState(prev => ({
                    ...prev,
                    time_remaining: Math.max(0, prev.time_remaining - 1)
                }));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState.is_running, gameState.time_remaining]);

    // Auto-pause when quarter ends
    useEffect(() => {
        if (gameState.time_remaining === 0 && gameState.is_running) {
            setGameState(prev => ({ ...prev, is_running: false }));
        }
    }, [gameState.time_remaining, gameState.is_running]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const selectGame = (gameId) => {
        router.get(route('scoresheet.show', gameId));
    };

    const updateGameState = (updates) => {
        const newGameState = { ...gameState, ...updates };
        setGameState(newGameState);
        
        if (selectedGame) {
            // Include active players in the update
            const gameUpdateData = {
                ...newGameState,
                team_a_active_players: activePlayers[selectedGame.team_a_id] || [],
                team_b_active_players: activePlayers[selectedGame.team_b_id] || []
            };
            
            router.post(route('scoresheet.update-state', selectedGame.id), gameUpdateData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Game state updated successfully
                },
                onError: (errors) => {
                    console.error('Error updating game state:', errors);
                    // Revert local state on error
                    setGameState(gameState);
                }
            });
        }
    };

    const toggleGameClock = () => {
        updateGameState({ is_running: !gameState.is_running });
    };

    const resetClock = () => {
        const minutesPerQuarter = gameState.minutes_per_quarter || gameRules.minutes_per_quarter;
        updateGameState({ 
            time_remaining: minutesPerQuarter * 60, 
            is_running: false 
        });
    };

    const nextQuarter = () => {
        const totalQuarters = gameState.total_quarters || gameRules.total_quarters;
        const minutesPerQuarter = gameState.minutes_per_quarter || gameRules.minutes_per_quarter;
        const timeoutsPerQuarter = gameState.timeouts_per_quarter || gameRules.timeouts_per_quarter;
        
        if (gameState.quarter < totalQuarters) {
            updateGameState({
                quarter: gameState.quarter + 1,
                time_remaining: minutesPerQuarter * 60,
                is_running: false,
                team_a_fouls: 0,
                team_b_fouls: 0,
                team_a_timeouts: timeoutsPerQuarter,
                team_b_timeouts: timeoutsPerQuarter
            });
        }
    };

    const useTimeout = (team) => {
        const timeoutField = team === 'a' ? 'team_a_timeouts' : 'team_b_timeouts';
        const currentTimeouts = gameState[timeoutField];
        
        if (currentTimeouts > 0) {
            updateGameState({
                [timeoutField]: currentTimeouts - 1,
                is_running: false
            });
            
            // Track timeout action for undo
            const action = {
                id: `timeout-${Date.now()}`,
                type: 'timeout',
                team: team,
                timestamp: Date.now(),
                quarter: gameState.quarter,
                gameTime: formatTime(gameState.time_remaining)
            };
            
            setActionHistory(prev => ({
                ...prev,
                [`team_${team}_timeout`]: [...(prev[`team_${team}_timeout`] || []), action]
            }));
            
            setHasUnsavedChanges(true);
        }
    };
    
    const undoTimeout = (team) => {
        const timeoutField = team === 'a' ? 'team_a_timeouts' : 'team_b_timeouts';
        const actionKey = `team_${team}_timeout`;
        const timeoutActions = actionHistory[actionKey] || [];
        const maxTimeouts = gameState.timeouts_per_quarter || gameRules.timeouts_per_quarter;
        
        if (timeoutActions.length > 0 && gameState[timeoutField] < maxTimeouts) {
            setGameState(prev => ({
                ...prev,
                [timeoutField]: prev[timeoutField] + 1
            }));
            
            // Remove last timeout action
            setActionHistory(prev => ({
                ...prev,
                [actionKey]: timeoutActions.slice(0, -1)
            }));
            
            setHasUnsavedChanges(true);
        }
    };

    const openEditMatchup = () => {
        if (selectedGame) {
            setEditMatchupForm({
                league_id: selectedGame.league_id || '',
                team_a_id: selectedGame.team_a_id || '',
                team_b_id: selectedGame.team_b_id || '',
                date: selectedGame.date || '',
                venue: selectedGame.venue || ''
            });
            setShowEditMatchup(true);
        }
    };

    const handleEditMatchup = (e) => {
        e.preventDefault();
        if (!selectedGame) return;

        router.put(route('scoresheet.update-matchup', selectedGame.id), editMatchupForm, {
            preserveState: true,
            onSuccess: () => {
                setShowEditMatchup(false);
                setEditMatchupForm({
                    league_id: '',
                    team_a_id: '',
                    team_b_id: '',
                    date: '',
                    venue: ''
                });
            },
            onError: (errors) => {
                console.error('Error updating matchup:', errors);
            }
        });
    };

    const applyGameRules = () => {
        const minutesPerQuarter = gameRules.minutes_per_quarter;
        const timeoutsPerQuarter = gameRules.timeouts_per_quarter;
        
        setGameState(prev => ({
            ...prev,
            time_remaining: minutesPerQuarter * 60,
            total_quarters: gameRules.total_quarters,
            minutes_per_quarter: minutesPerQuarter,
            timeouts_per_quarter: timeoutsPerQuarter,
            team_a_timeouts: timeoutsPerQuarter,
            team_b_timeouts: timeoutsPerQuarter
        }));
        
        setShowGameRules(false);
        setHasUnsavedChanges(true);
    };

    const recordFieldGoal = (playerId, points, made) => {
        if (!selectedGame) return;
        
        console.log(`Recording field goal: Player ${playerId}, ${points}pt, Made: ${made}`);
        
        setLocalPlayerStats(prev => {
            const currentStats = prev[playerId] || {
                player_id: playerId,
                points: 0,
                field_goals_made: 0,
                field_goals_attempted: 0,
                three_pointers_made: 0,
                three_pointers_attempted: 0,
                free_throws_made: 0,
                free_throws_attempted: 0,
                assists: 0,
                rebounds: 0,
                fouls: 0,
                steals: 0,
                blocks: 0
            };
            
            const updatedStats = { ...currentStats };
            
            // Update attempt counts - this happens for both made and missed shots
            if (points === 3) {
                updatedStats.three_pointers_attempted = (updatedStats.three_pointers_attempted || 0) + 1;
                updatedStats.field_goals_attempted = (updatedStats.field_goals_attempted || 0) + 1;
                if (made) {
                    updatedStats.three_pointers_made = (updatedStats.three_pointers_made || 0) + 1;
                    updatedStats.field_goals_made = (updatedStats.field_goals_made || 0) + 1;
                    updatedStats.points = (updatedStats.points || 0) + 3;
                }
            } else if (points === 2) {
                updatedStats.field_goals_attempted = (updatedStats.field_goals_attempted || 0) + 1;
                if (made) {
                    updatedStats.field_goals_made = (updatedStats.field_goals_made || 0) + 1;
                    updatedStats.points = (updatedStats.points || 0) + 2;
                }
            } else if (points === 1) {
                updatedStats.free_throws_attempted = (updatedStats.free_throws_attempted || 0) + 1;
                if (made) {
                    updatedStats.free_throws_made = (updatedStats.free_throws_made || 0) + 1;
                    updatedStats.points = (updatedStats.points || 0) + 1;
                }
            }
            
            console.log(`Updated stats for player ${playerId}:`, updatedStats);
            return { ...prev, [playerId]: updatedStats };
        });
        
        // Update team scores locally
        const player = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
            .find(p => (p.user?.id || p.id) === playerId);
        
        if (player && made) {
            const isTeamA = selectedGame.team_a?.players?.some(p => (p.user?.id || p.id) === playerId);
            setGameState(prev => ({
                ...prev,
                team_a_score: isTeamA ? prev.team_a_score + points : prev.team_a_score,
                team_b_score: !isTeamA ? prev.team_b_score + points : prev.team_b_score
            }));
        }
        
        // Track action history for individual undo
        const action = {
            id: `action-${Date.now()}`,
            type: 'field_goal',
            points: points,
            made: made,
            timestamp: Date.now(),
            quarter: gameState.quarter,
            gameTime: formatTime(gameState.time_remaining)
        };
        
        setActionHistory(prev => ({
            ...prev,
            [playerId]: [...(prev[playerId] || []), action]
        }));
        
        setHasUnsavedChanges(true);
    };

    const updatePlayerStat = (playerId, statType, value) => {
        if (!selectedGame) return;
        
        setLocalPlayerStats(prev => {
            const currentStats = prev[playerId] || {
                player_id: playerId,
                points: 0,
                field_goals_made: 0,
                field_goals_attempted: 0,
                three_pointers_made: 0,
                three_pointers_attempted: 0,
                free_throws_made: 0,
                free_throws_attempted: 0,
                assists: 0,
                rebounds: 0,
                fouls: 0,
                steals: 0,
                blocks: 0
            };
            
            const updatedStats = { ...currentStats };
            updatedStats[statType] = Math.max(0, (updatedStats[statType] || 0) + value);
            
            return { ...prev, [playerId]: updatedStats };
        });
        
        // Update team fouls when a player foul is added
        if (statType === 'fouls' && value > 0) {
            const player = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
                .find(p => (p.user?.id || p.id) === playerId);
            
            if (player) {
                const isTeamA = selectedGame.team_a?.players?.some(p => (p.user?.id || p.id) === playerId);
                setGameState(prev => ({
                    ...prev,
                    team_a_fouls: isTeamA ? prev.team_a_fouls + value : prev.team_a_fouls,
                    team_b_fouls: !isTeamA ? prev.team_b_fouls + value : prev.team_b_fouls
                }));
            }
        }
        
        // Track action history for individual undo
        const action = {
            id: `action-${Date.now()}`,
            type: 'stat',
            statType: statType,
            value: value,
            timestamp: Date.now(),
            quarter: gameState.quarter,
            gameTime: formatTime(gameState.time_remaining)
        };
        
        setActionHistory(prev => ({
            ...prev,
            [playerId]: [...(prev[playerId] || []), action]
        }));
        
        setHasUnsavedChanges(true);
    };
    
    const saveAllChanges = async () => {
        if (!selectedGame || !hasUnsavedChanges) return;
        
        setIsSaving(true);
        
        try {
            // Save game state with active players
            const gameUpdateData = {
                ...gameState,
                team_a_active_players: activePlayers[selectedGame.team_a_id] || [],
                team_b_active_players: activePlayers[selectedGame.team_b_id] || []
            };
            
            router.post(route('scoresheet.update-state', selectedGame.id), gameUpdateData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Game state and active players saved successfully');
                },
                onError: (errors) => {
                    console.error('Error saving game state:', errors);
                }
            });
            
            // Save all player stats using individual stat updates
            for (const [playerId, stats] of Object.entries(localPlayerStats)) {
                // Save each stat type individually
                const statTypes = ['points', 'assists', 'rebounds', 'steals', 'blocks', 'fouls', 'field_goals_made', 'field_goals_attempted', 'three_pointers_made', 'three_pointers_attempted', 'free_throws_made', 'free_throws_attempted'];
                
                for (const statType of statTypes) {
                    if (stats[statType] && stats[statType] > 0) {
                        router.post(route('scoresheet.record-stat', selectedGame.id), {
                            player_id: playerId,
                            stat_type: statType,
                            value: stats[statType],
                            quarter: gameState.quarter
                        }, {
                            preserveState: true,
                            preserveScroll: true,
                        });
                    }
                }
            }
            
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const resetPlayerStats = (playerId) => {
        setLocalPlayerStats(prev => {
            const newStats = { ...prev };
            delete newStats[playerId];
            return newStats;
        });
        setHasUnsavedChanges(true);
    };

    const undoLastAction = () => {
        // Simple undo by refreshing from server data
        if (selectedGame?.player_stats) {
            const statsMap = {};
            selectedGame.player_stats.forEach(stat => {
                statsMap[stat.player_id] = { ...stat };
            });
            setLocalPlayerStats(statsMap);
            setGameState(prev => ({
                ...prev,
                team_a_score: selectedGame.team_a_score || 0,
                team_b_score: selectedGame.team_b_score || 0
            }));
            setHasUnsavedChanges(false);
        }
    };

    const makeSubstitution = () => {
        if (isMultipleSubMode) {
            makeMultipleSubstitutions();
            return;
        }
        
        if (!playerOut || !playerIn || !selectedTeamForSub) {
            alert('Please select both players for substitution');
            return;
        }

        const timeString = formatTime(gameState.time_remaining);
        
        // Update active players
        setActivePlayers(prev => ({
            ...prev,
            [selectedTeamForSub]: prev[selectedTeamForSub].map(id => 
                id === playerOut ? playerIn : id
            )
        }));

        // Log substitution
        const playerOutName = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
            .find(p => (p.user?.id || p.id) === playerOut)?.user?.name || 
            [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
            .find(p => (p.user?.id || p.id) === playerOut)?.name;
        
        const playerInName = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
            .find(p => (p.user?.id || p.id) === playerIn)?.user?.name || 
            [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
            .find(p => (p.user?.id || p.id) === playerIn)?.name;
        
        const newSub = {
            id: `sub-${Date.now()}`,
            quarter: gameState.quarter,
            time: timeString,
            player_out_id: playerOut,
            player_in_id: playerIn,
            player_out_name: playerOutName,
            player_in_name: playerInName,
            team_id: selectedTeamForSub
        };
        
        setSubstitutions(prev => [...prev, newSub]);
        setHasUnsavedChanges(true);
        
        // Save active players to database
        saveActivePlayers();
        
        setShowSubDialog(false);
        setPlayerOut('');
        setPlayerIn('');
        setSelectedTeamForSub('');
    };
    
    const makeMultipleSubstitutions = () => {
        if (multipleSubstitutions.length === 0) {
            alert('Please add at least one substitution');
            return;
        }
        
        // Validate all substitutions
        for (const sub of multipleSubstitutions) {
            if (!sub.playerOut || !sub.playerIn) {
                alert('Please complete all substitution pairs');
                return;
            }
        }
        
        const timeString = formatTime(gameState.time_remaining);
        const allPlayers = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])];
        
        // Update active players for all substitutions
        setActivePlayers(prev => {
            let newActivePlayers = { ...prev };
            
            multipleSubstitutions.forEach(sub => {
                newActivePlayers[selectedTeamForSub] = newActivePlayers[selectedTeamForSub].map(id => 
                    id === sub.playerOut ? sub.playerIn : id
                );
            });
            
            return newActivePlayers;
        });
        
        // Log all substitutions
        const newSubs = multipleSubstitutions.map((sub, index) => {
            const playerOutName = allPlayers.find(p => (p.user?.id || p.id) === sub.playerOut)?.user?.name || 
                                 allPlayers.find(p => (p.user?.id || p.id) === sub.playerOut)?.name;
            
            const playerInName = allPlayers.find(p => (p.user?.id || p.id) === sub.playerIn)?.user?.name || 
                                allPlayers.find(p => (p.user?.id || p.id) === sub.playerIn)?.name;
            
            return {
                id: `sub-${Date.now()}-${index}`,
                quarter: gameState.quarter,
                time: timeString,
                player_out_id: sub.playerOut,
                player_in_id: sub.playerIn,
                player_out_name: playerOutName,
                player_in_name: playerInName,
                team_id: selectedTeamForSub
            };
        });
        
        setSubstitutions(prev => [...prev, ...newSubs]);
        setHasUnsavedChanges(true);
        
        // Save active players to database
        saveActivePlayers();
        
        // Reset dialog
        setShowSubDialog(false);
        setMultipleSubstitutions([]);
        setIsMultipleSubMode(false);
        setSelectedTeamForSub('');
    };
    
    const saveActivePlayers = () => {
        if (selectedGame) {
            const gameUpdateData = {
                ...gameState,
                team_a_active_players: activePlayers[selectedGame.team_a_id] || [],
                team_b_active_players: activePlayers[selectedGame.team_b_id] || []
            };
            
            router.post(route('scoresheet.update-state', selectedGame.id), gameUpdateData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Active players saved successfully');
                },
                onError: (errors) => {
                    console.error('Error saving active players:', errors);
                }
            });
        }
    };
    
    const addSubstitutionPair = () => {
        setMultipleSubstitutions(prev => [...prev, { playerOut: '', playerIn: '' }]);
    };
    
    const removeSubstitutionPair = (index) => {
        setMultipleSubstitutions(prev => prev.filter((_, i) => i !== index));
    };
    
    const updateSubstitutionPair = (index, field, value) => {
        setMultipleSubstitutions(prev => 
            prev.map((sub, i) => 
                i === index ? { ...sub, [field]: value } : sub
            )
        );
    };
    
    const openActivePlayersModal = (teamId) => {
        setActivePlayersTeamId(teamId);
        setShowActivePlayersModal(true);
    };
    
    const togglePlayerActive = (playerId, teamId) => {
        setActivePlayers(prev => {
            const currentActive = prev[teamId] || [];
            const isCurrentlyActive = currentActive.includes(playerId);
            
            if (isCurrentlyActive) {
                // Remove from active (substitute out)
                return {
                    ...prev,
                    [teamId]: currentActive.filter(id => id !== playerId)
                };
            } else {
                // Add to active (substitute in)
                if (currentActive.length >= 5) {
                    alert('Cannot have more than 5 active players. Please remove a player first.');
                    return prev;
                }
                return {
                    ...prev,
                    [teamId]: [...currentActive, playerId]
                };
            }
        });
        
        // Log this as a substitution for tracking
        const timeString = formatTime(gameState.time_remaining);
        const allPlayers = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])];
        const player = allPlayers.find(p => (p.user?.id || p.id) === playerId);
        const playerName = player?.user?.name || player?.name;
        
        const currentActive = activePlayers[teamId] || [];
        const isCurrentlyActive = currentActive.includes(playerId);
        
        if (isCurrentlyActive) {
            // Player being removed - this is a substitution out
            const newSub = {
                id: `quick-sub-${Date.now()}`,
                quarter: gameState.quarter,
                time: timeString,
                player_out_id: playerId,
                player_in_id: null,
                player_out_name: playerName,
                player_in_name: 'Bench',
                team_id: teamId,
                type: 'quick_sub_out'
            };
            setSubstitutions(prev => [...prev, newSub]);
        } else {
            // Player being added - this is a substitution in
            const newSub = {
                id: `quick-sub-${Date.now()}`,
                quarter: gameState.quarter,
                time: timeString,
                player_out_id: null,
                player_in_id: playerId,
                player_out_name: 'Bench',
                player_in_name: playerName,
                team_id: teamId,
                type: 'quick_sub_in'
            };
            setSubstitutions(prev => [...prev, newSub]);
        }
        
        setHasUnsavedChanges(true);
    };

    const openSubDialog = (teamId, multipleMode = false) => {
        setSelectedTeamForSub(teamId);
        setIsMultipleSubMode(multipleMode);
        if (multipleMode) {
            setMultipleSubstitutions([{ playerOut: '', playerIn: '' }]);
        } else {
            setPlayerOut('');
            setPlayerIn('');
        }
        setShowSubDialog(true);
    };

    const undoPlayerAction = (playerId) => {
        const playerActions = actionHistory[playerId] || [];
        if (playerActions.length === 0) {
            return; // No actions to undo
        }

        const lastAction = playerActions[playerActions.length - 1];
        
        // Remove the last action from history
        setActionHistory(prev => ({
            ...prev,
            [playerId]: prev[playerId].slice(0, -1)
        }));

        // Revert the stat changes
        setLocalPlayerStats(prev => {
            const currentStats = prev[playerId] || {};
            const updatedStats = { ...currentStats };
            
            if (lastAction.type === 'field_goal') {
                const { points, made } = lastAction;
                
                if (points === 3) {
                    updatedStats.three_pointers_attempted = Math.max(0, (updatedStats.three_pointers_attempted || 0) - 1);
                    updatedStats.field_goals_attempted = Math.max(0, (updatedStats.field_goals_attempted || 0) - 1);
                    if (made) {
                        updatedStats.three_pointers_made = Math.max(0, (updatedStats.three_pointers_made || 0) - 1);
                        updatedStats.field_goals_made = Math.max(0, (updatedStats.field_goals_made || 0) - 1);
                        updatedStats.points = Math.max(0, (updatedStats.points || 0) - 3);
                    }
                } else if (points === 2) {
                    updatedStats.field_goals_attempted = Math.max(0, (updatedStats.field_goals_attempted || 0) - 1);
                    if (made) {
                        updatedStats.field_goals_made = Math.max(0, (updatedStats.field_goals_made || 0) - 1);
                        updatedStats.points = Math.max(0, (updatedStats.points || 0) - 2);
                    }
                } else if (points === 1) {
                    updatedStats.free_throws_attempted = Math.max(0, (updatedStats.free_throws_attempted || 0) - 1);
                    if (made) {
                        updatedStats.free_throws_made = Math.max(0, (updatedStats.free_throws_made || 0) - 1);
                        updatedStats.points = Math.max(0, (updatedStats.points || 0) - 1);
                    }
                }
                
                // Revert team score for made shots
                if (made) {
                    const player = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
                        .find(p => (p.user?.id || p.id) === playerId);
                    
                    if (player) {
                        const isTeamA = selectedGame.team_a?.players?.some(p => (p.user?.id || p.id) === playerId);
                        setGameState(prev => ({
                            ...prev,
                            team_a_score: isTeamA ? Math.max(0, prev.team_a_score - points) : prev.team_a_score,
                            team_b_score: !isTeamA ? Math.max(0, prev.team_b_score - points) : prev.team_b_score
                        }));
                    }
                }
            } else if (lastAction.type === 'stat') {
                // Revert regular stat
                const { statType, value } = lastAction;
                updatedStats[statType] = Math.max(0, (updatedStats[statType] || 0) - value);
            }
            
            return { ...prev, [playerId]: updatedStats };
        });
        
        setHasUnsavedChanges(true);
    };
    
    const createMatchup = async (e) => {
        e.preventDefault();
        
        if (!matchupForm.league_id || !matchupForm.team_a_id || !matchupForm.team_b_id || !matchupForm.date) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (matchupForm.team_a_id === matchupForm.team_b_id) {
            alert('Please select different teams');
            return;
        }
        
        setIsCreatingMatchup(true);
        
        router.post(route('scoresheet.create-matchup'), matchupForm, {
            onSuccess: () => {
                // The redirect will handle navigation back to scoresheet.index
                // with the success message displayed
                setShowCreateMatchup(false);
                setMatchupForm({
                    league_id: '',
                    team_a_id: '',
                    team_b_id: '',
                    date: '',
                    venue: ''
                });
            },
            onError: (errors) => {
                console.error('Error creating matchup:', errors);
                const errorMessage = errors.error || Object.values(errors)[0] || 'Failed to create matchup';
                alert(errorMessage);
            },
            onFinish: () => {
                setIsCreatingMatchup(false);
            }
        });
    };
    
    const getTeamsForLeague = (leagueId) => {
        if (!leagueId || !allTeams) return [];
        return allTeams.filter(team => team.league_id == leagueId);
    };
    
    const getFilteredGames = () => {
        let filteredGames = games || [];
        
        // Filter by league
        if (selectedLeague) {
            filteredGames = filteredGames.filter(game => game.league_id == selectedLeague);
        }
        
        // Filter by season
        if (selectedSeason) {
            filteredGames = filteredGames.filter(game => game.league?.year == selectedSeason);
        }
        
        // Filter games that need scoring (scheduled or in_progress)
        if (showNeedsScoringOnly) {
            filteredGames = filteredGames.filter(game => 
                game.status === 'scheduled' || game.status === 'in_progress'
            );
        }
        
        return filteredGames;
    };
    
    const getAvailableSeasons = () => {
        if (!leagues) return [];
        const seasons = [...new Set(leagues.map(league => league.year))].sort((a, b) => b - a);
        return seasons;
    };

    const QuickButton = ({ onClick, children, className = "", compact = false }) => (
        <button
            onClick={onClick}
            className={`${compact ? 'h-6 w-8 text-xs' : 'h-7 w-9 text-xs'} p-0 font-medium border rounded hover:bg-gray-100 transition-colors flex items-center justify-center leading-none ${className}`}
        >
            {children}
        </button>
    );

    const PlayerRow = ({ player, teamColor, isActive = true }) => {
        const playerId = player.user?.id || player.id;
        const stats = localPlayerStats[playerId] || {};
        
        if (!isActive) return null;
        
        return (
            <tr className={`border-b hover:bg-gray-50 ${teamColor}`}>
                <td className="px-1 py-1 text-center font-mono font-bold text-xs border-r">{player.jersey_number || player.number || '00'}</td>
                <td className="px-2 py-1 font-medium text-xs border-r max-w-[80px] truncate" title={player.user?.name || player.name}>
                    {(player.user?.name || player.name)?.split(' ').pop() || 'Unknown'}
                </td>
                <td className="px-1 py-1 text-center font-bold text-lg border-r">{stats?.points || 0}</td>
                <td className="px-1 py-1 text-center text-xs border-r">
                    {stats?.field_goals_made || 0}/{stats?.field_goals_attempted || 0}
                </td>
                <td className="px-1 py-1 text-center text-xs border-r">
                    {stats?.three_pointers_made || 0}/{stats?.three_pointers_attempted || 0}
                </td>
                <td className="px-1 py-1 text-center text-xs border-r">
                    {stats?.free_throws_made || 0}/{stats?.free_throws_attempted || 0}
                </td>
                <td className="px-1 py-1 text-center text-xs border-r">{stats?.assists || 0}</td>
                <td className="px-1 py-1 text-center text-xs border-r">{stats?.rebounds || 0}</td>
                <td className="px-1 py-1 text-center text-xs border-r">{stats?.steals || 0}</td>
                <td className="px-1 py-1 text-center text-xs border-r">{stats?.blocks || 0}</td>
                <td className="px-1 py-1 text-center text-xs border-r">{stats?.fouls || 0}</td>
                <td className="px-1 py-1 border-r">
                    <div className="flex gap-0.5 justify-center">
                        <QuickButton
                            onClick={() => recordFieldGoal(playerId, 2, true)}
                            className="bg-green-100 hover:bg-green-200 border-green-300 text-green-800"
                            compact
                        >
                            2✓
                        </QuickButton>
                        <QuickButton
                            onClick={() => recordFieldGoal(playerId, 2, false)}
                            className="bg-red-100 hover:bg-red-200 border-red-300 text-red-800"
                            compact
                        >
                            2✗
                        </QuickButton>
                    </div>
                </td>
                <td className="px-1 py-1 border-r">
                    <div className="flex gap-0.5 justify-center">
                        <QuickButton
                            onClick={() => recordFieldGoal(playerId, 3, true)}
                            className="bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-800"
                            compact
                        >
                            3✓
                        </QuickButton>
                        <QuickButton
                            onClick={() => recordFieldGoal(playerId, 3, false)}
                            className="bg-red-100 hover:bg-red-200 border-red-300 text-red-800"
                            compact
                        >
                            3✗
                        </QuickButton>
                    </div>
                </td>
                <td className="px-1 py-1 border-r">
                    <div className="flex gap-0.5 justify-center">
                        <QuickButton
                            onClick={() => recordFieldGoal(playerId, 1, true)}
                            className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800"
                            compact
                        >
                            FT✓
                        </QuickButton>
                        <QuickButton
                            onClick={() => recordFieldGoal(playerId, 1, false)}
                            className="bg-red-100 hover:bg-red-200 border-red-300 text-red-800"
                            compact
                        >
                            FT✗
                        </QuickButton>
                    </div>
                </td>
                <td className="px-1 py-1 border-r">
                    <div className="grid grid-cols-3 gap-0.5">
                        <QuickButton
                            onClick={() => updatePlayerStat(playerId, 'assists', 1)}
                            className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800 text-xs"
                            compact
                        >
                            A+
                        </QuickButton>
                        <QuickButton
                            onClick={() => updatePlayerStat(playerId, 'rebounds', 1)}
                            className="bg-orange-100 hover:bg-orange-200 border-orange-300 text-orange-800 text-xs"
                            compact
                        >
                            R+
                        </QuickButton>
                        <QuickButton
                            onClick={() => updatePlayerStat(playerId, 'steals', 1)}
                            className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800 text-xs"
                            compact
                        >
                            S+
                        </QuickButton>
                        <QuickButton
                            onClick={() => updatePlayerStat(playerId, 'blocks', 1)}
                            className="bg-green-100 hover:bg-green-200 border-green-300 text-green-800 text-xs"
                            compact
                        >
                            B+
                        </QuickButton>
                        <QuickButton
                            onClick={() => updatePlayerStat(playerId, 'fouls', 1)}
                            className="bg-red-100 hover:bg-red-200 border-red-300 text-red-800 text-xs"
                            compact
                        >
                            F+
                        </QuickButton>
                        <div></div>
                    </div>
                </td>
                <td className="px-1 py-1 text-center">
                    <button
                        onClick={() => undoPlayerAction(playerId)}
                        disabled={!actionHistory[playerId] || actionHistory[playerId].length === 0}
                        className={`h-6 w-10 p-0 text-xs rounded transition-colors flex items-center justify-center ${
                            actionHistory[playerId] && actionHistory[playerId].length > 0
                                ? 'bg-red-100 hover:bg-red-200 border border-red-300 text-red-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                        title={actionHistory[playerId] && actionHistory[playerId].length > 0 
                            ? `Undo last action (${actionHistory[playerId].length} actions)` 
                            : 'No actions to undo'
                        }
                    >
                        <Undo2 className="h-3 w-3" />
                    </button>
                </td>
            </tr>
        );
    };

    // If no game selected, show game selection
    if (!selectedGame) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <Trophy className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Live Digital Scoresheet
                            </h2>
                            <p className="text-sm text-gray-600">Select a game to start live scoring</p>
                        </div>
                    </div>
                }
            >
                <Head title="Live Scoresheet" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                        
                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                                {flash.success}
                            </div>
                        )}
                        
                        {flash?.error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                                {flash.error}
                            </div>
                        )}

                        {/* Demo Notice */}
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <div>
                                <p className="font-medium">Live Digital Scoresheet</p>
                                <p className="text-sm">Real-time basketball game scoring and statistics tracking system.</p>
                            </div>
                        </div>

                        {/* League Selection and Matchup Creation */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">League & Game Management</h3>
                                    {(userRole === 'admin' || userRole === 'referee') && (
                                        <button
                                            onClick={() => setShowCreateMatchup(true)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Create Matchup
                                        </button>
                                    )}
                                </div>
                                
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by Season
                                        </label>
                                        <select
                                            value={selectedSeason}
                                            onChange={(e) => setSelectedSeason(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        >
                                            <option value="">All Seasons</option>
                                            {getAvailableSeasons().map((year) => (
                                                <option key={year} value={year}>
                                                    {year} Season
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Filter by League
                                        </label>
                                        <select
                                            value={selectedLeague}
                                            onChange={(e) => setSelectedLeague(e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                        >
                                            <option value="">All Leagues</option>
                                            {leagues?.filter(league => !selectedSeason || league.year == selectedSeason).map((league) => (
                                                <option key={league.id} value={league.id}>
                                                    {league.name} ({league.year})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Game Status
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={showNeedsScoringOnly}
                                                    onChange={(e) => setShowNeedsScoringOnly(e.target.checked)}
                                                    className="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-600">Games needing scoring only</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Game Selection */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Select Game to Score</h3>
                                
                                {getFilteredGames().length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {getFilteredGames().map((game) => (
                                            <div key={game.id} 
                                                 className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                 onClick={() => selectGame(game.id)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium text-gray-900">
                                                                {game.team_a?.name || 'Team A'} vs {game.team_b?.name || 'Team B'}
                                                            </h4>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                game.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                                game.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                                {game.status === 'scheduled' ? '⏰ Scheduled' :
                                                                 game.status === 'in_progress' ? '🔴 LIVE' :
                                                                 '✅ Completed'}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <div className="flex items-center gap-4 text-xs">
                                                                <span>📅 {new Date(game.date).toLocaleDateString()} {new Date(game.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                                {game.venue && <span>📍 {game.venue}</span>}
                                                                {game.league && <span>🏆 {game.league.name} ({game.league.year})</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        {game.status === 'in_progress' && (
                                                            <div className="text-xs text-yellow-600 font-medium">NEEDS ATTENTION</div>
                                                        )}
                                                        <button className={`px-3 py-1 rounded text-sm font-medium ${
                                                            game.status === 'in_progress' 
                                                                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                                                                : 'bg-orange-600 hover:bg-orange-700 text-white'
                                                        }`}>
                                                            {game.status === 'in_progress' ? 'Continue Scoring' : 'Start Scoring'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            {selectedLeague ? 'No games available for the selected league' : 'No games available for live scoring'}
                                        </p>
                                        {(userRole === 'admin' || userRole === 'referee') && (
                                            <button
                                                onClick={() => setShowCreateMatchup(true)}
                                                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Create New Matchup
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Create Matchup Modal */}
                {showCreateMatchup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-4">Create New Matchup</h3>
                            
                            <form onSubmit={createMatchup} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        League *
                                    </label>
                                    <select
                                        value={matchupForm.league_id}
                                        onChange={(e) => {
                                            setMatchupForm(prev => ({ 
                                                ...prev, 
                                                league_id: e.target.value,
                                                team_a_id: '',
                                                team_b_id: ''
                                            }));
                                        }}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">Select a league</option>
                                        {leagues?.map((league) => (
                                            <option key={league.id} value={league.id}>
                                                {league.name} ({league.year})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Team A *
                                    </label>
                                    <select
                                        value={matchupForm.team_a_id}
                                        onChange={(e) => setMatchupForm(prev => ({ ...prev, team_a_id: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        disabled={!matchupForm.league_id}
                                        required
                                    >
                                        <option value="">Select Team A</option>
                                        {getTeamsForLeague(matchupForm.league_id).map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name} ({team.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Team B *
                                    </label>
                                    <select
                                        value={matchupForm.team_b_id}
                                        onChange={(e) => setMatchupForm(prev => ({ ...prev, team_b_id: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        disabled={!matchupForm.league_id}
                                        required
                                    >
                                        <option value="">Select Team B</option>
                                        {getTeamsForLeague(matchupForm.league_id)
                                            .filter(team => team.id != matchupForm.team_a_id)
                                            .map((team) => (
                                                <option key={team.id} value={team.id}>
                                                    {team.name} ({team.code})
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Game Date & Time *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={matchupForm.date}
                                        onChange={(e) => setMatchupForm(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={matchupForm.venue}
                                        onChange={(e) => setMatchupForm(prev => ({ ...prev, venue: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g. Municipal Gym, Court 1"
                                    />
                                </div>
                                
                                <div className="flex gap-2 mt-6">
                                    <button
                                        type="submit"
                                        disabled={isCreatingMatchup}
                                        className={`flex-1 px-4 py-2 rounded font-medium ${
                                            isCreatingMatchup 
                                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    >
                                        {isCreatingMatchup ? 'Creating...' : 'Create Matchup'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateMatchup(false);
                                            setMatchupForm({
                                                league_id: '',
                                                team_a_id: '',
                                                team_b_id: '',
                                                date: '',
                                                venue: ''
                                            });
                                        }}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        );
    }

    // Game is selected, show live scoresheet
    const teamAPlayers = selectedGame.team_a?.players || [];
    const teamBPlayers = selectedGame.team_b?.players || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <Trophy className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Live Scoresheet: {selectedGame.team_a?.name} vs {selectedGame.team_b?.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-600">Quarter {gameState.quarter} - {formatTime(gameState.time_remaining)}</p>
                                {hasUnsavedChanges && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        ⚠️ Unsaved Changes
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {hasUnsavedChanges && (
                            <button
                                onClick={saveAllChanges}
                                disabled={isSaving}
                                className={`px-4 py-2 rounded font-medium ${
                                    isSaving 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {isSaving ? 'Saving...' : '💾 Save Changes'}
                            </button>
                        )}
                        <button 
                            onClick={() => router.get(route('scoresheet.index'))}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Back to Games
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Live Scoresheet - ${selectedGame.team_a?.name} vs ${selectedGame.team_b?.name}`} />

            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-2">
                    
                    {/* Game Header - Compact */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                            {/* Team A */}
                            <div className="text-center">
                                <h3 className="text-sm font-bold text-blue-800 truncate">{selectedGame.team_a?.name}</h3>
                                <div className="text-3xl font-bold text-blue-900">{gameState.team_a_score}</div>
                                <div className="text-xs text-blue-700">
                                    F:{gameState.team_a_fouls} | TO:{gameState.team_a_timeouts}
                                </div>
                            </div>

                            {/* Game Clock */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="text-lg font-bold text-gray-800">Q{gameState.quarter}</div>
                                    <div className="text-2xl font-mono font-bold text-gray-900">
                                        {formatTime(gameState.time_remaining)}
                                    </div>
                                    {gameState.is_running && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
                                </div>
                                <div className="flex justify-center gap-3 flex-wrap">
                                    <button
                                        onClick={toggleGameClock}
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            gameState.is_running 
                                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                        }`}
                                    >
                                        {gameState.is_running ? <><Pause className="h-3 w-3 inline mr-1" />Pause</> : <><Play className="h-3 w-3 inline mr-1" />Start</>}
                                    </button>
                                    <button
                                        onClick={resetClock}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs"
                                    >
                                        <RotateCcw className="h-3 w-3 inline mr-1" />Reset
                                    </button>
                                    {gameState.quarter < (gameState.total_quarters || gameRules.total_quarters) && (
                                        <button
                                            onClick={nextQuarter}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                        >
                                            Next Q
                                        </button>
                                    )}
                                </div>
                                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                                    <button
                                        onClick={openEditMatchup}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
                                        title="Edit Matchup Details"
                                    >
                                        Edit Matchup
                                    </button>
                                    <button
                                        onClick={() => setShowGameRules(true)}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs"
                                        title="Configure Game Rules"
                                    >
                                        Game Rules
                                    </button>
                                </div>
                                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                                    <div className="flex gap-0.5">
                                        <button
                                            onClick={() => useTimeout('a')}
                                            disabled={gameState.team_a_timeouts <= 0}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-1 py-0.5 rounded text-xs"
                                        >
                                            A-TO({gameState.team_a_timeouts})
                                        </button>
                                        <button
                                            onClick={() => undoTimeout('a')}
                                            disabled={!actionHistory[`team_a_timeout`] || actionHistory[`team_a_timeout`].length === 0 || gameState.team_a_timeouts >= (gameState.timeouts_per_quarter || gameRules.timeouts_per_quarter)}
                                            className="bg-blue-400 hover:bg-blue-500 disabled:bg-gray-300 text-white px-1 py-0.5 rounded text-xs"
                                            title="Undo timeout"
                                        >
                                            ↶
                                        </button>
                                    </div>
                                    <div className="flex gap-0.5">
                                        <button
                                            onClick={() => useTimeout('b')}
                                            disabled={gameState.team_b_timeouts <= 0}
                                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-1 py-0.5 rounded text-xs"
                                        >
                                            B-TO({gameState.team_b_timeouts})
                                        </button>
                                        <button
                                            onClick={() => undoTimeout('b')}
                                            disabled={!actionHistory[`team_b_timeout`] || actionHistory[`team_b_timeout`].length === 0 || gameState.team_b_timeouts >= (gameState.timeouts_per_quarter || gameRules.timeouts_per_quarter)}
                                            className="bg-green-400 hover:bg-green-500 disabled:bg-gray-300 text-white px-1 py-0.5 rounded text-xs"
                                            title="Undo timeout"
                                        >
                                            ↶
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => openActivePlayersModal(selectedGame.team_a_id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-1 py-0.5 rounded text-xs"
                                    >
                                        Sub-A
                                    </button>
                                    <button
                                        onClick={() => openActivePlayersModal(selectedGame.team_b_id)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-1 py-0.5 rounded text-xs"
                                    >
                                        Sub-B
                                    </button>
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="text-center">
                                <h3 className="text-sm font-bold text-green-800 truncate">{selectedGame.team_b?.name}</h3>
                                <div className="text-3xl font-bold text-green-900">{gameState.team_b_score}</div>
                                <div className="text-xs text-green-700">
                                    F:{gameState.team_b_fouls} | TO:{gameState.team_b_timeouts}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Panel */}
                    {hasUnsavedChanges && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <span className="text-xs font-medium text-yellow-800">
                                        You have unsaved changes
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={undoLastAction}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                                    >
                                        <Undo2 className="h-3 w-3 inline mr-1" />
                                        Revert All
                                    </button>
                                    <button
                                        onClick={saveAllChanges}
                                        disabled={isSaving}
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            isSaving 
                                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700 text-white'
                                        }`}
                                    >
                                        {isSaving ? 'Saving...' : '💾 Save All'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Substitution Dialog */}
                    {showSubDialog && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        {isMultipleSubMode ? 'Multiple Player Substitutions' : 'Player Substitution'}
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIsMultipleSubMode(false)}
                                            className={`px-3 py-1 rounded text-sm ${
                                                !isMultipleSubMode 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Single
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsMultipleSubMode(true);
                                                if (multipleSubstitutions.length === 0) {
                                                    setMultipleSubstitutions([{ playerOut: '', playerIn: '' }]);
                                                }
                                            }}
                                            className={`px-3 py-1 rounded text-sm ${
                                                isMultipleSubMode 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Multiple
                                        </button>
                                    </div>
                                </div>
                                
                                {!isMultipleSubMode ? (
                                    // Single substitution mode
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Player Coming Out
                                            </label>
                                            <select
                                                value={playerOut}
                                                onChange={(e) => setPlayerOut(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select player to substitute out</option>
                                                {activePlayers[selectedTeamForSub]?.map(playerId => {
                                                    const player = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
                                                        .find(p => (p.user?.id || p.id) === playerId);
                                                    return (
                                                        <option key={playerId} value={playerId}>
                                                            #{player?.number || '00'} {player?.user?.name || player?.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Player Coming In
                                            </label>
                                            <select
                                                value={playerIn}
                                                onChange={(e) => setPlayerIn(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select player to substitute in</option>
                                                {(selectedTeamForSub === selectedGame.team_a_id ? selectedGame.team_a?.players : selectedGame.team_b?.players || [])
                                                    .filter(p => !activePlayers[selectedTeamForSub]?.includes(p.user?.id || p.id))
                                                    .map(player => (
                                                        <option key={player.id} value={player.user?.id || player.id}>
                                                            #{player.number || '00'} {player.user?.name || player.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    // Multiple substitutions mode
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Add multiple substitution pairs for this team
                                            </span>
                                            <button
                                                onClick={addSubstitutionPair}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                            >
                                                + Add Pair
                                            </button>
                                        </div>
                                        
                                        {multipleSubstitutions.map((sub, index) => {
                                            // Get currently used players for validation
                                            const usedOutPlayers = multipleSubstitutions.slice(0, index).map(s => s.playerOut).filter(Boolean);
                                            const usedInPlayers = multipleSubstitutions.slice(0, index).map(s => s.playerIn).filter(Boolean);
                                            
                                            return (
                                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            Substitution {index + 1}
                                                        </span>
                                                        {multipleSubstitutions.length > 1 && (
                                                            <button
                                                                onClick={() => removeSubstitutionPair(index)}
                                                                className="text-red-600 hover:text-red-800 text-sm"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Player Out
                                                            </label>
                                                            <select
                                                                value={sub.playerOut}
                                                                onChange={(e) => updateSubstitutionPair(index, 'playerOut', e.target.value)}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">Select player out</option>
                                                                {activePlayers[selectedTeamForSub]?.filter(playerId => !usedOutPlayers.includes(playerId)).map(playerId => {
                                                                    const player = [...(selectedGame.team_a?.players || []), ...(selectedGame.team_b?.players || [])]
                                                                        .find(p => (p.user?.id || p.id) === playerId);
                                                                    return (
                                                                        <option key={playerId} value={playerId}>
                                                                            #{player?.number || '00'} {player?.user?.name || player?.name}
                                                                        </option>
                                                                    );
                                                                })}
                                                            </select>
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                                Player In
                                                            </label>
                                                            <select
                                                                value={sub.playerIn}
                                                                onChange={(e) => updateSubstitutionPair(index, 'playerIn', e.target.value)}
                                                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">Select player in</option>
                                                                {(selectedTeamForSub === selectedGame.team_a_id ? selectedGame.team_a?.players : selectedGame.team_b?.players || [])
                                                                    .filter(p => {
                                                                        const playerId = p.user?.id || p.id;
                                                                        return !activePlayers[selectedTeamForSub]?.includes(playerId) && 
                                                                               !usedInPlayers.includes(playerId);
                                                                    })
                                                                    .map(player => (
                                                                        <option key={player.id} value={player.user?.id || player.id}>
                                                                            #{player.number || '00'} {player.user?.name || player.name}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                
                                <div className="flex gap-2 mt-6">
                                    <button
                                        onClick={makeSubstitution}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
                                    >
                                        {isMultipleSubMode ? `Make ${multipleSubstitutions.length} Substitutions` : 'Make Substitution'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowSubDialog(false);
                                            setPlayerOut('');
                                            setPlayerIn('');
                                            setMultipleSubstitutions([]);
                                            setIsMultipleSubMode(false);
                                            setSelectedTeamForSub('');
                                        }}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Players Modal */}
                    {showActivePlayersModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">
                                        {activePlayersTeamId === selectedGame.team_a_id ? selectedGame.team_a?.name : selectedGame.team_b?.name} - Active Players
                                    </h3>
                                    <button
                                        onClick={() => setShowActivePlayersModal(false)}
                                        className="text-gray-400 hover:text-gray-600 text-xl"
                                    >
                                        ×
                                    </button>
                                </div>
                                
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="text-sm text-blue-800 mb-2">
                                        <strong>Active Players: {activePlayers[activePlayersTeamId]?.length || 0}/5</strong>
                                    </div>
                                    <div className="text-xs text-blue-600">
                                        Click players to add/remove from active lineup. Maximum 5 players can be active.
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    {(activePlayersTeamId === selectedGame.team_a_id ? selectedGame.team_a?.players : selectedGame.team_b?.players || []).map(player => {
                                        const playerId = player.user?.id || player.id;
                                        const isActive = activePlayers[activePlayersTeamId]?.includes(playerId);
                                        const stats = localPlayerStats[playerId] || {};
                                        
                                        return (
                                            <div
                                                key={player.id}
                                                onClick={() => togglePlayerActive(playerId, activePlayersTeamId)}
                                                className={`cursor-pointer border-2 rounded-lg p-3 transition-all ${
                                                    isActive 
                                                        ? 'border-green-500 bg-green-50 shadow-md' 
                                                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                                            isActive 
                                                                ? 'border-green-500 bg-green-500' 
                                                                : 'border-gray-300'
                                                        }`}>
                                                            {isActive && <span className="text-white text-xs">✓</span>}
                                                        </div>
                                                        <div className="font-mono font-bold text-sm text-gray-600">
                                                            #{player.number || '00'}
                                                        </div>
                                                        <div className="font-medium">
                                                            {player.user?.name || player.name}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-gray-600">
                                                        <span>PTS: {stats?.points || 0}</span>
                                                        <span>FG: {stats?.field_goals_made || 0}/{stats?.field_goals_attempted || 0}</span>
                                                        <span className={`px-2 py-1 rounded ${
                                                            isActive 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {isActive ? 'ACTIVE' : 'BENCH'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                <div className="flex gap-2 mt-6">
                                    <button
                                        onClick={() => {
                                            // Quick action: Set starting 5 (first 5 players)
                                            const teamPlayers = activePlayersTeamId === selectedGame.team_a_id ? selectedGame.team_a?.players : selectedGame.team_b?.players || [];
                                            const starting5 = teamPlayers.slice(0, 5).map(p => p.user?.id || p.id);
                                            setActivePlayers(prev => ({
                                                ...prev,
                                                [activePlayersTeamId]: starting5
                                            }));
                                            setHasUnsavedChanges(true);
                                        }}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium text-sm"
                                    >
                                        Set Starting 5
                                    </button>
                                    <button
                                        onClick={() => {
                                            // Clear all active players
                                            setActivePlayers(prev => ({
                                                ...prev,
                                                [activePlayersTeamId]: []
                                            }));
                                            setHasUnsavedChanges(true);
                                        }}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium text-sm"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowActivePlayersModal(false)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium text-sm"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Substitutions */}
                    {substitutions.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-2">
                            <h3 className="text-xs font-medium text-gray-900 mb-1">Recent Subs</h3>
                            <div className="flex flex-wrap gap-1">
                                {(() => {
                                    // Group substitutions by time and quarter to show multiple subs together
                                    const groupedSubs = {};
                                    substitutions.forEach(sub => {
                                        const key = `${sub.quarter}-${sub.time}`;
                                        if (!groupedSubs[key]) {
                                            groupedSubs[key] = [];
                                        }
                                        groupedSubs[key].push(sub);
                                    });
                                    
                                    return Object.values(groupedSubs)
                                        .slice(-3) // Show last 3 substitution groups
                                        .reverse()
                                        .map((subGroup, groupIndex) => {
                                            const firstSub = subGroup[0];
                                            const teamColor = firstSub.team_id === selectedGame.team_a_id ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
                                            
                                            if (subGroup.length === 1) {
                                                // Single substitution
                                                const sub = firstSub;
                                                let displayText = '';
                                                
                                                if (sub.type === 'quick_sub_in') {
                                                    displayText = `${sub.player_in_name?.split(' ')[0]} ↗ ON (Q${sub.quarter})`;
                                                } else if (sub.type === 'quick_sub_out') {
                                                    displayText = `${sub.player_out_name?.split(' ')[0]} ↘ OFF (Q${sub.quarter})`;
                                                } else {
                                                    displayText = `${sub.player_in_name?.split(' ')[0]} ↔ ${sub.player_out_name?.split(' ')[0]} (Q${sub.quarter})`;
                                                }
                                                
                                                return (
                                                    <span key={`group-${groupIndex}`} className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${teamColor}`}>
                                                        {displayText}
                                                    </span>
                                                );
                                            } else {
                                                // Multiple substitutions at same time
                                                return (
                                                    <div key={`group-${groupIndex}`} className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${teamColor} flex-col`}>
                                                        <div className="font-semibold">Multiple Subs (Q{firstSub.quarter})</div>
                                                        <div className="text-xs">
                                                            {subGroup.map((sub, index) => (
                                                                <span key={sub.id}>
                                                                    {sub.player_in_name?.split(' ')[0]} ↔ {sub.player_out_name?.split(' ')[0]}
                                                                    {index < subGroup.length - 1 ? ', ' : ''}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        });
                                })()}
                            </div>
                        </div>
                    )}

                    {/* Live Stats Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-3 py-1 bg-gray-50 border-b flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">Live Player Statistics</h3>
                            <div className="text-xs text-gray-600 font-mono">
                                {gameState.team_a_score} - {gameState.team_b_score}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">JER</th>
                                        <th className="px-2 py-2 text-left text-xs font-bold text-gray-700 border-r">PLAYER</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">PTS</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">FG</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">3PT</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">FT</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">A</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">R</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">S</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">B</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">F</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">2PT</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">3PT</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">FT</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700 border-r">+/-</th>
                                        <th className="px-1 py-2 text-center text-xs font-bold text-gray-700">↶</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Team A Active Players */}
                                    {teamAPlayers.map((player) => {
                                        const playerId = player.user?.id || player.id;
                                        const isActive = activePlayers[selectedGame.team_a_id]?.includes(playerId);
                                        return (
                                            <PlayerRow 
                                                key={player.id} 
                                                player={player} 
                                                teamColor="bg-blue-25"
                                                isActive={isActive}
                                            />
                                        );
                                    })}
                                    
                                    {/* Separator */}
                                    <tr className="bg-gray-100">
                                        <td colSpan="15" className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                                            {selectedGame.team_b?.name} Players (Active: {activePlayers[selectedGame.team_b_id]?.length || 0}/5)
                                        </td>
                                    </tr>
                                    
                                    {/* Team B Active Players */}
                                    {teamBPlayers.map((player) => {
                                        const playerId = player.user?.id || player.id;
                                        const isActive = activePlayers[selectedGame.team_b_id]?.includes(playerId);
                                        return (
                                            <PlayerRow 
                                                key={player.id} 
                                                player={player} 
                                                teamColor="bg-green-25"
                                                isActive={isActive}
                                            />
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Create Matchup Modal */}
            {showCreateMatchup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Create New Matchup</h3>
                        
                        <form onSubmit={createMatchup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    League *
                                </label>
                                <select
                                    value={matchupForm.league_id}
                                    onChange={(e) => {
                                        setMatchupForm(prev => ({ 
                                            ...prev, 
                                            league_id: e.target.value,
                                            team_a_id: '',
                                            team_b_id: ''
                                        }));
                                    }}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                >
                                    <option value="">Select a league</option>
                                    {leagues?.map((league) => (
                                        <option key={league.id} value={league.id}>
                                            {league.name} ({league.year})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team A *
                                </label>
                                <select
                                    value={matchupForm.team_a_id}
                                    onChange={(e) => setMatchupForm(prev => ({ ...prev, team_a_id: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={!matchupForm.league_id}
                                    required
                                >
                                    <option value="">Select Team A</option>
                                    {getTeamsForLeague(matchupForm.league_id).map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name} ({team.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Team B *
                                </label>
                                <select
                                    value={matchupForm.team_b_id}
                                    onChange={(e) => setMatchupForm(prev => ({ ...prev, team_b_id: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={!matchupForm.league_id}
                                    required
                                >
                                    <option value="">Select Team B</option>
                                    {getTeamsForLeague(matchupForm.league_id)
                                        .filter(team => team.id != matchupForm.team_a_id)
                                        .map((team) => (
                                            <option key={team.id} value={team.id}>
                                                {team.name} ({team.code})
                                            </option>
                                        ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Game Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={matchupForm.date}
                                    onChange={(e) => setMatchupForm(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Venue
                                </label>
                                <input
                                    type="text"
                                    value={matchupForm.venue}
                                    onChange={(e) => setMatchupForm(prev => ({ ...prev, venue: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="e.g. Municipal Gym, Court 1"
                                />
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                                <button
                                    type="submit"
                                    disabled={isCreatingMatchup}
                                    className={`flex-1 px-4 py-2 rounded font-medium ${
                                        isCreatingMatchup 
                                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                                            : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                >
                                    {isCreatingMatchup ? 'Creating...' : 'Create Matchup'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateMatchup(false);
                                        setMatchupForm({
                                            league_id: '',
                                            team_a_id: '',
                                            team_b_id: '',
                                            date: '',
                                            venue: ''
                                        });
                                    }}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Matchup Modal */}
            {showEditMatchup && selectedGame && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Matchup</h3>
                        
                        <form onSubmit={handleEditMatchup}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        League
                                    </label>
                                    <select
                                        value={editMatchupForm.league_id}
                                        onChange={(e) => setEditMatchupForm(prev => ({ ...prev, league_id: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Select League</option>
                                        {leagues?.map(league => (
                                            <option key={league.id} value={league.id}>{league.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team A
                                    </label>
                                    <select
                                        value={editMatchupForm.team_a_id}
                                        onChange={(e) => setEditMatchupForm(prev => ({ ...prev, team_a_id: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select Team A</option>
                                        {allTeams?.map(team => (
                                            <option key={team.id} value={team.id}>{team.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Team B
                                    </label>
                                    <select
                                        value={editMatchupForm.team_b_id}
                                        onChange={(e) => setEditMatchupForm(prev => ({ ...prev, team_b_id: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    >
                                        <option value="">Select Team B</option>
                                        {allTeams?.filter(team => team.id !== editMatchupForm.team_a_id).map(team => (
                                            <option key={team.id} value={team.id}>{team.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={editMatchupForm.date}
                                        onChange={(e) => setEditMatchupForm(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Venue
                                    </label>
                                    <input
                                        type="text"
                                        value={editMatchupForm.venue}
                                        onChange={(e) => setEditMatchupForm(prev => ({ ...prev, venue: e.target.value }))}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="e.g. Municipal Gym, Court 1"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2 mt-6">
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium"
                                >
                                    Update Matchup
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditMatchup(false)}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Game Rules Modal */}
            {showGameRules && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Configure Game Rules</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Set the game format and timing rules. Changes will apply to the current game.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Quarters
                                </label>
                                <select
                                    value={gameRules.total_quarters}
                                    onChange={(e) => setGameRules(prev => ({ ...prev, total_quarters: parseInt(e.target.value) }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={2}>2 Quarters</option>
                                    <option value={4}>4 Quarters</option>
                                    <option value={6}>6 Quarters</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minutes per Quarter
                                </label>
                                <select
                                    value={gameRules.minutes_per_quarter}
                                    onChange={(e) => setGameRules(prev => ({ ...prev, minutes_per_quarter: parseInt(e.target.value) }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={5}>5 Minutes</option>
                                    <option value={8}>8 Minutes</option>
                                    <option value={10}>10 Minutes</option>
                                    <option value={12}>12 Minutes</option>
                                    <option value={15}>15 Minutes</option>
                                    <option value={20}>20 Minutes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Timeouts per Quarter
                                </label>
                                <select
                                    value={gameRules.timeouts_per_quarter}
                                    onChange={(e) => setGameRules(prev => ({ ...prev, timeouts_per_quarter: parseInt(e.target.value) }))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={1}>1 Timeout</option>
                                    <option value={2}>2 Timeouts</option>
                                    <option value={3}>3 Timeouts</option>
                                    <option value={4}>4 Timeouts</option>
                                </select>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Current Settings:</strong><br/>
                                    Q{gameState.quarter} of {gameState.total_quarters || gameRules.total_quarters} | 
                                    {gameState.minutes_per_quarter || gameRules.minutes_per_quarter}min quarters | 
                                    {gameState.timeouts_per_quarter || gameRules.timeouts_per_quarter} timeouts/quarter
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={applyGameRules}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium"
                            >
                                Apply Rules
                            </button>
                            <button
                                onClick={() => setShowGameRules(false)}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}