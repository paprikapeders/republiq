import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar, MapPin, Trophy, Users, Clock } from 'lucide-react';

export default function GameDetail({ game, mvpSettings }) {
    
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            time: date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
    };

    const gameDateTime = formatDateTime(game.date);
    const isCompleted = game.status === 'completed';

    // Get team data with fallbacks
    const teamA = game.teamA || game.team_a;
    const teamB = game.teamB || game.team_b;
    const playerStats = game.playerStats || game.player_stats || [];
    
    // Organize player stats by team with improved matching logic
    const homeTeamStats = playerStats.filter(stat => {
        if (!teamA?.players || !stat) return false;
        // Try multiple matching strategies for better accuracy
        return teamA.players.some(player => {
            // Match by player_id directly
            if (stat.player_id && player.id && stat.player_id === player.id) return true;
            // Match by user_id if available
            if (stat.player_id && player.user_id && stat.player_id === player.user_id) return true;
            // Match by nested player object
            if (stat.player?.id && player.id && stat.player.id === player.id) return true;
            // Match by nested user object
            if (stat.player?.user?.id && player.user?.id && stat.player.user.id === player.user.id) return true;
            return false;
        });
    }) || [];
    
    const awayTeamStats = playerStats.filter(stat => {
        if (!teamB?.players || !stat) return false;
        // Try multiple matching strategies for better accuracy
        return teamB.players.some(player => {
            // Match by player_id directly
            if (stat.player_id && player.id && stat.player_id === player.id) return true;
            // Match by user_id if available
            if (stat.player_id && player.user_id && stat.player_id === player.user_id) return true;
            // Match by nested player object
            if (stat.player?.id && player.id && stat.player.id === player.id) return true;
            // Match by nested user object
            if (stat.player?.user?.id && player.user?.id && stat.player.user.id === player.user.id) return true;
            return false;
        });
    }) || [];

    // Calculate team totals
    // Helper function to safely calculate team totals from player stats
    const calculateTeamTotals = (teamStats) => {
        const totals = {
            points: 0,
            threePointers: 0,
            twoPointers: 0,
            freeThrows: 0,
            rebounds: 0,
            assists: 0,
            fouls: 0
        };

        teamStats.forEach(stat => {
            if (stat) {
                // The stat object contains the player stats directly
                const playerPoints = parseInt(stat.points) || 0;
                const threePointersMade = parseInt(stat.three_pointers_made) || 0;
                const fieldGoalsMade = parseInt(stat.field_goals_made) || 0;
                const threePointersAttempted = parseInt(stat.three_pointers_attempted) || 0;
                const freeThrowsMade = parseInt(stat.free_throws_made) || 0;
                
                // Calculate two pointers (field goals minus three pointers)
                const twoPointersMade = Math.max(0, fieldGoalsMade - threePointersMade);
                
                // Calculate total points from individual stat types if main points is 0
                const calculatedPoints = playerPoints > 0 ? playerPoints : (threePointersMade * 3) + (twoPointersMade * 2) + freeThrowsMade;
                
                totals.points += calculatedPoints;
                totals.threePointers += threePointersMade;
                totals.twoPointers += twoPointersMade;
                totals.freeThrows += freeThrowsMade;
                totals.rebounds += parseInt(stat.rebounds) || 0;
                totals.assists += parseInt(stat.assists) || 0;
                totals.fouls += parseInt(stat.fouls) || 0;
            }
        });

        return totals;
    };
    
    const homeTeamTotals = calculateTeamTotals(homeTeamStats);
    const awayTeamTotals = calculateTeamTotals(awayTeamStats);
    
    // Use calculated player stats if available, otherwise use saved game scores
    // Prioritize game scores if they exist, fallback to calculated totals
    const homeScore = (game.team_a_score && game.team_a_score > 0) ? game.team_a_score : homeTeamTotals.points;
    const awayScore = (game.team_b_score && game.team_b_score > 0) ? game.team_b_score : awayTeamTotals.points;

    // Calculate MVP based on a comprehensive performance rating
    const calculateMVP = () => {
        if (!playerStats || playerStats.length === 0) return null;

        let mvpCandidate = null;
        let highestRating = -1;

        playerStats.forEach(stat => {
            // Find the player info for this stat
            let playerInfo = null;
            let teamName = '';
            
            // Check Team A players
            if (teamA?.players) {
                const player = teamA.players.find(p => 
                    (stat.player_id && p.id && stat.player_id === p.id) ||
                    (stat.player_id && p.user_id && stat.player_id === p.user_id) ||
                    (stat.player?.id && p.id && stat.player.id === p.id) ||
                    (stat.player?.user?.id && p.user?.id && stat.player.user.id === p.user.id)
                );
                if (player) {
                    playerInfo = player;
                    teamName = teamA.name;
                }
            }
            
            // Check Team B players if not found in Team A
            if (!playerInfo && teamB?.players) {
                const player = teamB.players.find(p => 
                    (stat.player_id && p.id && stat.player_id === p.id) ||
                    (stat.player_id && p.user_id && stat.player_id === p.user_id) ||
                    (stat.player?.id && p.id && stat.player.id === p.id) ||
                    (stat.player?.user?.id && p.user?.id && stat.player.user.id === p.user.id)
                );
                if (player) {
                    playerInfo = player;
                    teamName = teamB.name;
                }
            }

            if (playerInfo) {
                // Calculate performance rating (higher is better)
                const points = parseInt(stat.points) || 0;
                const rebounds = parseInt(stat.rebounds) || 0;
                const assists = parseInt(stat.assists) || 0;
                const steals = parseInt(stat.steals) || 0;
                const blocks = parseInt(stat.blocks) || 0;
                const fouls = parseInt(stat.fouls) || 0;
                const turnovers = parseInt(stat.turnovers) || 0;
                
                // Calculate shooting efficiency
                const fgMade = parseInt(stat.field_goals_made) || 0;
                const fgAttempted = parseInt(stat.field_goals_attempted) || 0;
                const fgPercentage = fgAttempted > 0 ? (fgMade / fgAttempted) : 0;
                
                // MVP Rating Formula: Weighted sum using configurable settings
                const settings = mvpSettings || {
                    points_weight: 1.0,
                    rebounds_weight: 1.2,
                    assists_weight: 1.5,
                    steals_weight: 2.0,
                    blocks_weight: 2.0,
                    shooting_efficiency_weight: 10.0,
                    fouls_penalty: 0.5,
                    turnovers_penalty: 1.0,
                };
                
                const rating = (
                    points * settings.points_weight +
                    rebounds * settings.rebounds_weight +
                    assists * settings.assists_weight +
                    steals * settings.steals_weight +
                    blocks * settings.blocks_weight +
                    (fgPercentage * settings.shooting_efficiency_weight) -
                    fouls * settings.fouls_penalty -
                    turnovers * settings.turnovers_penalty
                );

                if (rating > highestRating) {
                    highestRating = rating;
                    mvpCandidate = {
                        player: playerInfo,
                        stats: stat,
                        team: teamName,
                        rating: rating.toFixed(1)
                    };
                }
            }
        });

        return mvpCandidate;
    };

    const mvp = calculateMVP();

    const PlayerStatsTable = ({ teamStats, teamName, teamColor, teamPlayers = [] }) => {
        // Show all team players, not just those with stats
        const playersToShow = teamPlayers.length > 0 ? teamPlayers : [];
        
        return (
            <div className="bg-[#1a1a2e] rounded-lg p-3 lg:p-6 border border-[#16213e]">
                <h3 className="text-lg lg:text-xl font-bold text-white mb-3 lg:mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 lg:h-5 lg:w-5 text-orange-500" />
                    {teamName} Player Statistics
                </h3>
                
                {playersToShow.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-xs lg:text-sm">
                        <thead>
                            <tr className="border-b border-[#16213e]">
                                <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium">#</th>
                                <th className="text-left py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium">Player</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium">PTS</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium hidden sm:table-cell">FG</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium hidden md:table-cell">3PT</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium hidden md:table-cell">FT</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium">REB</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium">AST</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium hidden lg:table-cell">STL</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium hidden lg:table-cell">BLK</th>
                                <th className="text-center py-2 lg:py-3 px-1 lg:px-2 text-gray-300 font-medium hidden xl:table-cell">PF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playersToShow.map((player, index) => {
                                // Find stats for this player
                                const stat = teamStats.find(s => 
                                    s.player_id === player.id || 
                                    s.player?.user?.id === player.user?.id ||
                                    s.player?.id === player.id
                                ) || {};
                                
                                const fgPercentage = stat.field_goals_attempted > 0 ? 
                                    ((stat.field_goals_made / stat.field_goals_attempted) * 100).toFixed(1) : '0.0';
                                const threePercentage = stat.three_pointers_attempted > 0 ? 
                                    ((stat.three_pointers_made / stat.three_pointers_attempted) * 100).toFixed(1) : '0.0';
                                const ftPercentage = stat.free_throws_attempted > 0 ? 
                                    ((stat.free_throws_made / stat.free_throws_attempted) * 100).toFixed(1) : '0.0';

                                // Check if this player is the MVP
                                const isMvp = mvp && (
                                    (mvp.player.id === player.id) ||
                                    (mvp.player.user?.id === player.user?.id)
                                );

                                return (
                                    <tr key={index} className={`border-b border-[#16213e]/50 hover:bg-[#0f0f1e] transition-colors ${
                                        isMvp ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' : ''
                                    }`}>
                                        <td className={`py-3 px-2 font-bold ${isMvp ? 'text-yellow-400' : 'text-orange-400'}`}>
                                            {player?.jersey_number || player?.number || '--'}
                                            {isMvp && <Trophy className="h-4 w-4 inline ml-1 text-yellow-400" />}
                                        </td>
                                        <td className={`py-3 px-2 font-medium ${isMvp ? 'text-yellow-100' : 'text-white'}`}>
                                            {player?.user?.name || player?.name || 'Unknown Player'}
                                            {isMvp && <span className="text-xs ml-2 bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">MVP</span>}
                                        </td>
                                        <td className="py-3 px-2 text-center text-orange-400 font-bold">
                                            {stat.points || 0}
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-300">
                                            <div className="text-xs">
                                                {stat.field_goals_made || 0}/{stat.field_goals_attempted || 0}
                                                <span className="block text-gray-400">({fgPercentage}%)</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-300">
                                            <div className="text-xs">
                                                {stat.three_pointers_made || 0}/{stat.three_pointers_attempted || 0}
                                                <span className="block text-gray-400">({threePercentage}%)</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-300">
                                            <div className="text-xs">
                                                {stat.free_throws_made || 0}/{stat.free_throws_attempted || 0}
                                                <span className="block text-gray-400">({ftPercentage}%)</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-center text-gray-300">{stat.rebounds || 0}</td>
                                        <td className="py-3 px-2 text-center text-gray-300">{stat.assists || 0}</td>
                                        <td className="py-3 px-2 text-center text-gray-300">{stat.steals || 0}</td>
                                        <td className="py-3 px-2 text-center text-gray-300">{stat.blocks || 0}</td>
                                        <td className="py-3 px-2 text-center text-gray-300">{stat.fouls || 0}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    <p>No players available for this team.</p>
                </div>
            )}
        </div>
        );
    };

    const TeamTotalsCard = ({ title, totals }) => (
        <div className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{totals.points || 0}</div>
                    <div className="text-sm text-gray-400">Points</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totals.rebounds || 0}</div>
                    <div className="text-sm text-gray-400">Rebounds</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totals.assists || 0}</div>
                    <div className="text-sm text-gray-400">Assists</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-white">{totals.fouls || 0}</div>
                    <div className="text-sm text-gray-400">Fouls</div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                    3PT: {totals.threePointers || 0} | 2PT: {totals.twoPointers || 0} | FT: {totals.freeThrows || 0}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                    Calculated from player stats: {(totals.threePointers || 0) * 3 + (totals.twoPointers || 0) * 2 + (totals.freeThrows || 0)} points
                </div>
            </div>
        </div>
    );    return (
        <div className="min-h-screen bg-[#0f0f1e] text-white">
            <Head title={`${teamA?.name || 'Team A'} vs ${teamB?.name || 'Team B'} - Game Detail`} />
            
            {/* Header */}
            <div className="bg-[#1a1a2e] border-b border-[#16213e]">
                <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Schedule
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl lg:text-3xl font-bold text-white mb-2">
                                {teamA?.name || 'Team A'} vs {teamB?.name || 'Team B'}
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm lg:text-base text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="truncate">{gameDateTime.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {gameDateTime.time}
                                </div>
                                {game.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{game.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-left lg:text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                isCompleted 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {isCompleted ? '✅ Completed' : '⏳ Scheduled'}
                            </div>
                            {game.league && (
                                <div className="mt-2 text-sm text-gray-400">
                                    {game.league.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Game Score Card */}
            <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
                <div className="bg-[#1a1a2e] rounded-lg p-4 lg:p-8 border border-[#16213e] mb-6 lg:mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-center">
                        {/* Home Team */}
                        <div className="text-center">
                            <Link 
                                href={`/teams/${teamA?.id}`}
                                className="block hover:text-orange-400 transition-colors"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {teamA?.name || 'Team A'}
                                </h2>
                                <div className="text-4xl font-bold text-orange-400">
                                    {homeScore}
                                </div>
                            </Link>
                        </div>

                        {/* VS */}
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-400">VS</div>
                        </div>

                        {/* Away Team */}
                        <div className="text-center">
                            <Link 
                                href={`/teams/${teamB?.id}`}
                                className="block hover:text-orange-400 transition-colors"
                            >
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {teamB?.name || 'Team B'}
                                </h2>
                                <div className="text-4xl font-bold text-orange-400">
                                    {awayScore}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Team Totals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <TeamTotalsCard 
                        totals={homeTeamTotals} 
                        teamName={teamA?.name || 'Team A'} 
                        teamColor="orange" 
                    />
                    <TeamTotalsCard 
                        totals={awayTeamTotals} 
                        teamName={teamB?.name || 'Team B'} 
                        teamColor="blue" 
                    />
                </div>

                {/* MVP Section */}
                {mvp && isCompleted && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6">
                            <div className="flex items-center justify-center mb-4">
                                <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
                                <h3 className="text-2xl font-bold text-yellow-400">GAME MVP</h3>
                            </div>
                            
                            <div className="text-center">
                                <div className="bg-[#1a1a2e] rounded-lg p-6 border border-yellow-500/20">
                                    <div className="flex items-center justify-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">
                                                {mvp.player?.jersey_number || mvp.player?.number || '#'}
                                            </span>
                                        </div>
                                        <div className="text-left">
                                            <h4 className="text-2xl font-bold text-white">
                                                {mvp.player?.user?.name || mvp.player?.name}
                                            </h4>
                                            <p className="text-yellow-400 font-medium">{mvp.team}</p>
                                            <p className="text-gray-400 text-sm">MVP Rating: {mvp.rating}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div className="bg-[#0f0f1e] rounded-lg p-3">
                                            <div className="text-2xl font-bold text-orange-400">{mvp.stats.points || 0}</div>
                                            <div className="text-xs text-gray-400">Points</div>
                                        </div>
                                        <div className="bg-[#0f0f1e] rounded-lg p-3">
                                            <div className="text-2xl font-bold text-blue-400">{mvp.stats.rebounds || 0}</div>
                                            <div className="text-xs text-gray-400">Rebounds</div>
                                        </div>
                                        <div className="bg-[#0f0f1e] rounded-lg p-3">
                                            <div className="text-2xl font-bold text-green-400">{mvp.stats.assists || 0}</div>
                                            <div className="text-xs text-gray-400">Assists</div>
                                        </div>
                                        <div className="bg-[#0f0f1e] rounded-lg p-3">
                                            <div className="text-2xl font-bold text-purple-400">
                                                {(mvp.stats.field_goals_attempted > 0 ? 
                                                    ((mvp.stats.field_goals_made / mvp.stats.field_goals_attempted) * 100).toFixed(1) : 
                                                    '0.0')}%
                                            </div>
                                            <div className="text-xs text-gray-400">FG%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Player Statistics */}
                <div className="space-y-8">
                    <PlayerStatsTable 
                        teamStats={homeTeamStats} 
                        teamName={teamA?.name || 'Team A'}
                        teamColor="orange"
                        teamPlayers={teamA?.players || []}
                    />
                    <PlayerStatsTable 
                        teamStats={awayTeamStats} 
                        teamName={teamB?.name || 'Team B'}
                        teamColor="blue"
                        teamPlayers={teamB?.players || []}
                    />
                </div>

                {!isCompleted && (
                    <div className="mt-8 text-center">
                        <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#16213e]">
                            <p className="text-gray-400">
                                Game statistics will be available after the game is completed.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}