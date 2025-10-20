import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Trophy, Medal, Award, Target, Shield, Users, Zap, Eye, TrendingUp } from 'lucide-react';
import { PublicNavbar } from '@/Pages/Public/PublicNavbar';

export default function Leaderboards({ players, mvpSettings }) {
    const [activeTab, setActiveTab] = useState('overall');

    const handleNavigate = (page) => {
        if (page === 'schedules' || page === 'teams') {
            router.visit('/');
        } else if (page === 'leaderboards') {
            // Already on leaderboards page
            return;
        }
    };

    // Calculate MVP rating for each player using the same formula as games
    const calculatePlayerMVPRating = (player) => {
        if (!player.player_stats || player.player_stats.length === 0) return 0;
        
        const defaultSettings = {
            points_weight: 1.0,
            rebounds_weight: 1.2,
            assists_weight: 1.5,
            steals_weight: 2.0,
            blocks_weight: 2.0,
            shooting_efficiency_weight: 10.0,
            fouls_penalty: 0.5,
            turnovers_penalty: 1.0,
            games_played_weight: 0.5,
        };
        
        // Ensure all settings are valid numbers
        const settings = {};
        Object.keys(defaultSettings).forEach(key => {
            const value = mvpSettings && mvpSettings[key] !== undefined ? parseFloat(mvpSettings[key]) : defaultSettings[key];
            settings[key] = isNaN(value) ? defaultSettings[key] : value;
        });

        let totalRating = 0;
        let gamesPlayed = player.player_stats.length;
        
        // Validate inputs
        if (!gamesPlayed || gamesPlayed === 0) return 0;

        // Calculate total attempts and makes for better shooting efficiency
        let totalFgMade = 0;
        let totalFgAttempted = 0;

        player.player_stats.forEach(stat => {
            const points = parseFloat(stat.points) || 0;
            const rebounds = parseFloat(stat.rebounds) || 0;
            const assists = parseFloat(stat.assists) || 0;
            const steals = parseFloat(stat.steals) || 0;
            const blocks = parseFloat(stat.blocks) || 0;
            const fouls = parseFloat(stat.fouls) || 0;
            const turnovers = parseFloat(stat.turnovers) || 0;
            
            // Accumulate shooting stats
            const fgMade = parseFloat(stat.field_goals_made) || 0;
            const fgAttempted = parseFloat(stat.field_goals_attempted) || 0;
            totalFgMade += fgMade;
            totalFgAttempted += fgAttempted;
            
            const gameRating = (
                points * (settings.points_weight || 1.0) +
                rebounds * (settings.rebounds_weight || 1.2) +
                assists * (settings.assists_weight || 1.5) +
                steals * (settings.steals_weight || 2.0) +
                blocks * (settings.blocks_weight || 2.0) -
                fouls * (settings.fouls_penalty || 0.5) -
                turnovers * (settings.turnovers_penalty || 1.0)
            );
            
            // Ensure no NaN or negative base ratings
            const validGameRating = isNaN(gameRating) ? 0 : Math.max(0, gameRating);
            totalRating += validGameRating;
        });

        // Calculate overall shooting efficiency bonus
        let shootingBonus = 0;
        if (totalFgAttempted > 0) {
            const overallFgPercentage = totalFgMade / totalFgAttempted;
            const shootingWeight = settings.shooting_efficiency_weight || 10.0;
            // Reward consistent shooters with more attempts
            const attemptWeight = Math.min(totalFgAttempted / (gamesPlayed * 10), 1.5); // Max 1.5x for high-volume shooters
            shootingBonus = overallFgPercentage * shootingWeight * attemptWeight * gamesPlayed;
        }

        // Add shooting bonus to total rating
        totalRating += shootingBonus;

        // Validate totalRating before proceeding
        if (isNaN(totalRating)) {
            totalRating = 0;
        }

        // Enhanced games played weighting system
        const averageRating = gamesPlayed > 0 ? (totalRating / gamesPlayed) : 0;
        
        // Progressive games played multiplier (rewards consistency)
        let gamesPlayedMultiplier = 1.0;
        const minGames = 3; // Minimum games to avoid penalties
        const optimalGames = 10; // Games for full weight
        
        if (gamesPlayed < minGames) {
            // Significant penalty for very few games
            gamesPlayedMultiplier = 0.3 + (gamesPlayed / minGames) * 0.2;
        } else if (gamesPlayed < optimalGames) {
            // Gradual increase from 50% to 100% weight
            const progress = (gamesPlayed - minGames) / (optimalGames - minGames);
            const minWeight = Math.max(0, Math.min(1, settings.games_played_weight || 0.5));
            gamesPlayedMultiplier = minWeight + (1.0 - minWeight) * progress;
        } else {
            // Full weight for players with optimal games or more
            gamesPlayedMultiplier = 1.0;
        }
        
        const finalRating = averageRating * gamesPlayedMultiplier;
        
        // Ensure we never return NaN
        return isNaN(finalRating) ? 0 : finalRating;
    };

    // Calculate averages for each player
    const processedPlayers = players.map(player => {
        const stats = player.player_stats || [];
        const gamesPlayed = stats.length;
        
        if (gamesPlayed === 0) {
            return {
                ...player,
                averages: {
                    points: 0,
                    rebounds: 0,
                    assists: 0,
                    steals: 0,
                    blocks: 0,
                    fouls: 0,
                    turnovers: 0,
                    field_goals_made: 0,
                    field_goals_attempted: 0,
                    field_goal_percentage: 0,
                },
                mvpRating: 0,
                gamesPlayed: 0
            };
        }

        const totals = stats.reduce((acc, stat) => {
            acc.points += parseFloat(stat.points) || 0;
            acc.rebounds += parseFloat(stat.rebounds) || 0;
            acc.assists += parseFloat(stat.assists) || 0;
            acc.steals += parseFloat(stat.steals) || 0;
            acc.blocks += parseFloat(stat.blocks) || 0;
            acc.fouls += parseFloat(stat.fouls) || 0;
            acc.turnovers += parseFloat(stat.turnovers) || 0;
            acc.field_goals_made += parseFloat(stat.field_goals_made) || 0;
            acc.field_goals_attempted += parseFloat(stat.field_goals_attempted) || 0;
            return acc;
        }, {
            points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
            fouls: 0, turnovers: 0, field_goals_made: 0, field_goals_attempted: 0
        });

        const averages = {
            points: (totals.points / gamesPlayed).toFixed(1),
            rebounds: (totals.rebounds / gamesPlayed).toFixed(1),
            assists: (totals.assists / gamesPlayed).toFixed(1),
            steals: (totals.steals / gamesPlayed).toFixed(1),
            blocks: (totals.blocks / gamesPlayed).toFixed(1),
            fouls: (totals.fouls / gamesPlayed).toFixed(1),
            turnovers: (totals.turnovers / gamesPlayed).toFixed(1),
            field_goals_made: (totals.field_goals_made / gamesPlayed).toFixed(1),
            field_goals_attempted: (totals.field_goals_attempted / gamesPlayed).toFixed(1),
            field_goal_percentage: totals.field_goals_attempted > 0 
                ? ((totals.field_goals_made / totals.field_goals_attempted) * 100).toFixed(1)
                : 0,
            // Add weighted shooting efficiency that considers volume
            shooting_efficiency: totals.field_goals_attempted > 0 
                ? (((totals.field_goals_made / totals.field_goals_attempted) * Math.min(totals.field_goals_attempted / (gamesPlayed * 5), 2)) * 100).toFixed(1)
                : 0
        };

        return {
            ...player,
            averages,
            mvpRating: calculatePlayerMVPRating(player),
            gamesPlayed
        };
    });

    // Sort players for different categories
    const getLeaderboard = (category) => {
        const filtered = processedPlayers.filter(p => p.gamesPlayed > 0);
        
        // Helper function to sort with games played weighting
        const sortWithGamesPlayedWeight = (stat) => {
            return filtered.sort((a, b) => {
                // Apply games played weight to create weighted stat
                const minGames = 3;
                const getGameWeight = (games) => {
                    if (games < minGames) return 0.5; // Penalty for few games
                    return Math.min(games / 8, 1.0); // Progressive weight up to 8 games
                };
                
                const aWeighted = parseFloat(a.averages[stat]) * getGameWeight(a.gamesPlayed);
                const bWeighted = parseFloat(b.averages[stat]) * getGameWeight(b.gamesPlayed);
                
                const weightedDiff = bWeighted - aWeighted;
                if (Math.abs(weightedDiff) < 0.1) {
                    // If weighted stats are close, favor player with more games
                    return b.gamesPlayed - a.gamesPlayed;
                }
                return weightedDiff;
            });
        };
        
        switch (category) {
            case 'overall':
                return filtered.sort((a, b) => {
                    const mvpDiff = b.mvpRating - a.mvpRating;
                    if (Math.abs(mvpDiff) < 0.01) {
                        // If MVP ratings are essentially identical, favor consistency (more games)
                        return b.gamesPlayed - a.gamesPlayed;
                    }
                    return mvpDiff;
                });
            case 'points':
                return sortWithGamesPlayedWeight('points');
            case 'rebounds':
                return sortWithGamesPlayedWeight('rebounds');
            case 'assists':
                return sortWithGamesPlayedWeight('assists');
            case 'steals':
                return sortWithGamesPlayedWeight('steals');
            case 'blocks':
                return sortWithGamesPlayedWeight('blocks');
            case 'shooting':
                // For shooting, require minimum attempts and games
                return filtered
                    .filter(p => {
                        const totalAttempts = p.player_stats.reduce((sum, stat) => 
                            sum + (parseFloat(stat.field_goals_attempted) || 0), 0);
                        return p.gamesPlayed >= 3 && totalAttempts >= 20; // Min 3 games and 20 total attempts
                    })
                    .sort((a, b) => {
                        // Use shooting efficiency that considers both percentage and volume
                        const aEfficiency = parseFloat(a.averages.shooting_efficiency || a.averages.field_goal_percentage);
                        const bEfficiency = parseFloat(b.averages.shooting_efficiency || b.averages.field_goal_percentage);
                        
                        const efficiencyDiff = bEfficiency - aEfficiency;
                        if (Math.abs(efficiencyDiff) < 2) {
                            // If efficiency is close, favor player with more games and attempts
                            const aVolume = parseFloat(a.averages.field_goals_attempted) * a.gamesPlayed;
                            const bVolume = parseFloat(b.averages.field_goals_attempted) * b.gamesPlayed;
                            return bVolume - aVolume;
                        }
                        return efficiencyDiff;
                    });
            default:
                return filtered;
        }
    };

    const leaderboard = getLeaderboard(activeTab);
    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3, 10);

    const tabs = [
        { id: 'overall', label: 'Overall MVP', icon: Trophy },
        { id: 'points', label: 'Scoring', icon: Target },
        { id: 'rebounds', label: 'Rebounds', icon: Shield },
        { id: 'assists', label: 'Assists', icon: Users },
        { id: 'steals', label: 'Steals', icon: Zap },
        { id: 'blocks', label: 'Blocks', icon: Eye },
        { id: 'shooting', label: 'Shooting %', icon: TrendingUp },
    ];

    const getStatValue = (player, category) => {
        switch (category) {
            case 'overall':
                return player.mvpRating.toFixed(1);
            case 'points':
                return player.averages.points;
            case 'rebounds':
                return player.averages.rebounds;
            case 'assists':
                return player.averages.assists;
            case 'steals':
                return player.averages.steals;
            case 'blocks':
                return player.averages.blocks;
            case 'shooting':
                return `${player.averages.field_goal_percentage}%`;
            default:
                return '0';
        }
    };

    const getStatLabel = (category) => {
        switch (category) {
            case 'overall':
                return 'MVP Rating';
            case 'points':
                return 'PPG';
            case 'rebounds':
                return 'RPG';
            case 'assists':
                return 'APG';
            case 'steals':
                return 'SPG';
            case 'blocks':
                return 'BPG';
            case 'shooting':
                return 'FG%';
            default:
                return '';
        }
    };

    const getPodiumIcon = (position) => {
        switch (position) {
            case 0:
                return <Trophy className="h-8 w-8 text-yellow-400" />;
            case 1:
                return <Medal className="h-8 w-8 text-gray-300" />;
            case 2:
                return <Award className="h-8 w-8 text-amber-600" />;
            default:
                return null;
        }
    };

    return (
        <>
            <Head title="Leaderboards - Queens Ballers Republiq" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
                <PublicNavbar 
                    currentPage="leaderboards"
                    onNavigate={handleNavigate}
                />
                
                {/* Header */}
                <div className="bg-white/90 border-b border-orange-200/30 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
                        <div className="text-center">
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-1 lg:mb-2">Leaderboards</h1>
                            <p className="text-sm lg:text-base text-gray-400">Top performers in Queens Ballers Republiq</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 lg:py-8">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-6 lg:mb-8 px-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                            : 'bg-white/80 text-slate-600 hover:bg-white/90 border border-slate-200'
                                    }`}
                                >
                                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Top 3 Podium */}
                    {top3.length > 0 && (
                        <div className="mb-8 lg:mb-12">
                            <h2 className="text-xl lg:text-2xl font-bold text-slate-800 text-center mb-6 lg:mb-8">
                                Top 3 - {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto">
                                {/* 2nd Place */}
                                {top3[1] && (
                                    <div className="order-2 sm:order-1">
                                        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="flex justify-center mb-3 lg:mb-4">
                                                <Medal className="h-8 w-8 lg:h-12 lg:w-12 text-slate-400" />
                                            </div>
                                            
                                            {/* Player Image */}
                                            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center overflow-hidden">
                                                {top3[1].photo_path ? (
                                                    <img
                                                        src={`/storage/${top3[1].photo_path}`}
                                                        alt={top3[1].user?.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <Users className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                                                )}
                                            </div>
                                            
                                            <h3 className="text-base lg:text-lg font-bold text-slate-800 mb-1 lg:mb-2 truncate">
                                                {top3[1].user?.name || 'Unknown Player'}
                                            </h3>
                                            <p className="text-slate-600 text-xs lg:text-sm mb-2 lg:mb-3 truncate">{top3[1].team?.name}</p>
                                            
                                            <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg p-2 lg:p-3 mb-3 lg:mb-4">
                                                <p className="text-xl lg:text-2xl font-bold text-slate-700">{getStatValue(top3[1], activeTab)}</p>
                                                <p className="text-slate-600 text-xs lg:text-sm">{getStatLabel(activeTab)}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-1 lg:gap-2 text-xs text-slate-600">
                                                <div>
                                                    <p className="font-medium">{top3[1].averages.points}</p>
                                                    <p>PPG</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{top3[1].averages.rebounds}</p>
                                                    <p>RPG</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{top3[1].averages.assists}</p>
                                                    <p>APG</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{top3[1].gamesPlayed}</p>
                                                    <p>GP</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 1st Place */}
                                <div className="order-1 sm:order-2">
                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center border border-yellow-300 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 lg:hover:-translate-y-2">
                                        <div className="flex justify-center mb-3 lg:mb-4">
                                            <Trophy className="h-12 w-12 lg:h-16 lg:w-16 text-yellow-400" />
                                        </div>
                                        
                                        {/* Player Image */}
                                        <div className="w-20 h-20 lg:w-32 lg:h-32 mx-auto mb-4 lg:mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg overflow-hidden">
                                            {top3[0].photo_path ? (
                                                <img
                                                    src={`/storage/${top3[0].photo_path}`}
                                                    alt={top3[0].user?.name}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <Users className="h-10 w-10 lg:h-16 lg:w-16 text-white" />
                                            )}
                                        </div>
                                        
                                        <h3 className="text-xl lg:text-2xl font-bold text-slate-800 mb-1 lg:mb-2 truncate">
                                            {top3[0].user?.name || 'Unknown Player'}
                                        </h3>
                                        <p className="text-slate-600 text-sm lg:text-base mb-3 lg:mb-4 truncate">{top3[0].team?.name}</p>
                                        
                                        <div className="bg-gradient-to-r from-yellow-200 to-orange-200 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
                                            <p className="text-2xl lg:text-3xl font-bold text-orange-700">{getStatValue(top3[0], activeTab)}</p>
                                            <p className="text-orange-600 text-xs lg:text-sm">{getStatLabel(activeTab)}</p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2 lg:gap-3 text-xs lg:text-sm text-slate-600">
                                            <div>
                                                <p className="font-bold text-sm lg:text-lg">{top3[0].averages.points}</p>
                                                <p className="text-xs">PPG</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm lg:text-lg">{top3[0].averages.rebounds}</p>
                                                <p className="text-xs">RPG</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm lg:text-lg">{top3[0].averages.assists}</p>
                                                <p className="text-xs">APG</p>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm lg:text-lg">{top3[0].gamesPlayed}</p>
                                                <p className="text-xs">GP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                {top3[2] && (
                                    <div className="order-3 sm:order-3">
                                        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="flex justify-center mb-3 lg:mb-4">
                                                <Award className="h-8 w-8 lg:h-12 lg:w-12 text-amber-500" />
                                            </div>
                                            
                                            {/* Player Image */}
                                            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center overflow-hidden">
                                                {top3[2].photo_path ? (
                                                    <img
                                                        src={`/storage/${top3[2].photo_path}`}
                                                        alt={top3[2].user?.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <Users className="h-8 w-8 lg:h-12 lg:w-12 text-white" />
                                                )}
                                            </div>
                                            
                                            <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-1 truncate">
                                                {top3[2].user?.name || 'Unknown Player'}
                                            </h3>
                                            <p className="text-slate-600 text-xs lg:text-sm mb-2 lg:mb-3 truncate">{top3[2].team?.name}</p>
                                            
                                            <div className="bg-gradient-to-r from-amber-100 to-amber-200 rounded-lg p-2 lg:p-3 mb-3 lg:mb-4">
                                                <p className="text-xl lg:text-2xl font-bold text-amber-700">{getStatValue(top3[2], activeTab)}</p>
                                                <p className="text-amber-600 text-xs lg:text-sm">{getStatLabel(activeTab)}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-1 lg:gap-2 text-xs text-gray-400">
                                                <div>
                                                    <p className="font-medium">{top3[2].averages.points}</p>
                                                    <p>PPG</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{top3[2].averages.rebounds}</p>
                                                    <p>RPG</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{top3[2].averages.assists}</p>
                                                    <p>APG</p>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{top3[2].gamesPlayed}</p>
                                                    <p>GP</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Top 10 List */}
                    {rest.length > 0 && (
                        <div className="bg-white rounded-2xl p-3 lg:p-6 border border-slate-200 shadow-lg">
                            <h2 className="text-lg lg:text-xl font-bold text-slate-800 mb-4 lg:mb-6">Rankings 4-10</h2>
                            
                            <div className="space-y-3">
                                {rest.map((player, index) => (
                                    <div key={player.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 lg:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors gap-3 sm:gap-0 border border-slate-200">
                                        <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                                            <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-orange-600 font-bold text-xs lg:text-sm">{index + 4}</span>
                                            </div>
                                            
                                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {player.photo_path ? (
                                                    <img
                                                        src={`/storage/${player.photo_path}`}
                                                        alt={player.user?.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center">
                                                        <Users className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-slate-800 truncate text-sm lg:text-base">{player.user?.name || 'Unknown Player'}</h3>
                                                <p className="text-xs lg:text-sm text-slate-600 truncate">{player.team?.name}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="overflow-x-auto">
                                            <div className="flex items-center gap-3 sm:gap-4 text-xs lg:text-sm min-w-max px-2 sm:px-0">
                                            <div className="text-center min-w-[60px] px-2">
                                                <p className="font-bold text-slate-800 mb-1">{getStatValue(player, activeTab)}</p>
                                                <p className="text-slate-600">{getStatLabel(activeTab)}</p>
                                            </div>
                                            <div className="text-center min-w-[55px] px-2">
                                                <p className="font-bold text-orange-600 mb-1">{player.averages.points}</p>
                                                <p className="text-slate-600">PPG</p>
                                            </div>
                                            <div className="text-center min-w-[55px] px-2">
                                                <p className="font-bold text-slate-800 mb-1">{player.averages.rebounds}</p>
                                                <p className="text-slate-600">RPG</p>
                                            </div>
                                            <div className="text-center min-w-[55px] px-2">
                                                <p className="font-bold text-slate-800 mb-1">{player.averages.assists}</p>
                                                <p className="text-slate-600">APG</p>
                                            </div>
                                            <div className="text-center min-w-[45px] px-2">
                                                <p className="font-bold text-slate-800 mb-1">{player.gamesPlayed}</p>
                                                <p className="text-slate-600">GP</p>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {leaderboard.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-lg">
                            <Trophy className="h-24 w-24 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-slate-700 mb-2">No Statistics Available</h3>
                            <p className="text-slate-600">Player statistics will appear here once games are completed.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}