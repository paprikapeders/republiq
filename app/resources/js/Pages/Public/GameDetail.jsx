import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar, MapPin, Trophy, Users, Clock } from 'lucide-react';

export default function GameDetail({ game }) {
    // Debug logging
    console.log('Game data:', game);
    console.log('Team A:', game.teamA || game.team_a);
    console.log('Team B:', game.teamB || game.team_b);
    console.log('Player Stats:', game.playerStats || game.player_stats);
    console.log('Game keys:', Object.keys(game));
    
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

    // Organize player stats by team
    const homeTeamStats = playerStats.filter(stat => {
        if (!teamA?.players || !stat.player) return false;
        // Try matching by player ID first, then by user ID
        return teamA.players.some(player => 
            player.id === stat.player_id || 
            player.user?.id === stat.player?.user?.id ||
            player.id === stat.player?.id
        );
    }) || [];
    
    const awayTeamStats = playerStats.filter(stat => {
        if (!teamB?.players || !stat.player) return false;
        // Try matching by player ID first, then by user ID
        return teamB.players.some(player => 
            player.id === stat.player_id || 
            player.user?.id === stat.player?.user?.id ||
            player.id === stat.player?.id
        );
    }) || [];

    // Calculate team totals
    const calculateTeamTotals = (teamStats) => {
        return teamStats.reduce((totals, stat) => ({
            points: totals.points + (parseInt(stat.points) || 0),
            field_goals_made: totals.field_goals_made + (parseInt(stat.field_goals_made) || 0),
            field_goals_attempted: totals.field_goals_attempted + (parseInt(stat.field_goals_attempted) || 0),
            three_pointers_made: totals.three_pointers_made + (parseInt(stat.three_pointers_made) || 0),
            three_pointers_attempted: totals.three_pointers_attempted + (parseInt(stat.three_pointers_attempted) || 0),
            free_throws_made: totals.free_throws_made + (parseInt(stat.free_throws_made) || 0),
            free_throws_attempted: totals.free_throws_attempted + (parseInt(stat.free_throws_attempted) || 0),
            rebounds: totals.rebounds + (parseInt(stat.rebounds) || 0),
            assists: totals.assists + (parseInt(stat.assists) || 0),
            steals: totals.steals + (parseInt(stat.steals) || 0),
            blocks: totals.blocks + (parseInt(stat.blocks) || 0),
            fouls: totals.fouls + (parseInt(stat.fouls) || 0),
        }), {
            points: 0,
            field_goals_made: 0,
            field_goals_attempted: 0,
            three_pointers_made: 0,
            three_pointers_attempted: 0,
            free_throws_made: 0,
            free_throws_attempted: 0,
            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,
            fouls: 0,
        });
    };

    const homeTeamTotals = calculateTeamTotals(homeTeamStats);
    const awayTeamTotals = calculateTeamTotals(awayTeamStats);
    
    // Use saved game scores if player stats don't have points or if they're zero
    const homeScore = homeTeamTotals.points > 0 ? homeTeamTotals.points : (game.team_a_score || 0);
    const awayScore = awayTeamTotals.points > 0 ? awayTeamTotals.points : (game.team_b_score || 0);

    const PlayerStatsTable = ({ teamStats, teamName, teamColor, teamPlayers = [] }) => {
        // Show all team players, not just those with stats
        const playersToShow = teamPlayers.length > 0 ? teamPlayers : [];
        
        return (
            <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#16213e]">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    {teamName} Player Statistics
                </h3>
                
                {playersToShow.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#16213e]">
                                <th className="text-left py-3 px-2 text-gray-300 font-medium">#</th>
                                <th className="text-left py-3 px-2 text-gray-300 font-medium">Player</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">PTS</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">FG</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">3PT</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">FT</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">REB</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">AST</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">STL</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">BLK</th>
                                <th className="text-center py-3 px-2 text-gray-300 font-medium">PF</th>
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

                                return (
                                    <tr key={index} className="border-b border-[#16213e]/50 hover:bg-[#0f0f1e] transition-colors">
                                        <td className="py-3 px-2 text-orange-400 font-bold">
                                            {player?.jersey_number || player?.number || '--'}
                                        </td>
                                        <td className="py-3 px-2 text-white font-medium">
                                            {player?.user?.name || player?.name || 'Unknown Player'}
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

    const TeamTotalsCard = ({ totals, teamName, teamColor }) => (
        <div className="bg-[#1a1a2e] rounded-lg p-4 border border-[#16213e]">
            <h4 className="text-lg font-bold text-white mb-3">{teamName} Team Totals</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400">{totals.points}</div>
                    <div className="text-gray-400">Points</div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">
                        {totals.field_goals_made}/{totals.field_goals_attempted}
                    </div>
                    <div className="text-gray-400">Field Goals</div>
                    <div className="text-xs text-gray-500">
                        {totals.field_goals_attempted > 0 ? 
                            `(${((totals.field_goals_made / totals.field_goals_attempted) * 100).toFixed(1)}%)` : 
                            '(0.0%)'
                        }
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">
                        {totals.three_pointers_made}/{totals.three_pointers_attempted}
                    </div>
                    <div className="text-gray-400">3-Pointers</div>
                    <div className="text-xs text-gray-500">
                        {totals.three_pointers_attempted > 0 ? 
                            `(${((totals.three_pointers_made / totals.three_pointers_attempted) * 100).toFixed(1)}%)` : 
                            '(0.0%)'
                        }
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">
                        {totals.free_throws_made}/{totals.free_throws_attempted}
                    </div>
                    <div className="text-gray-400">Free Throws</div>
                    <div className="text-xs text-gray-500">
                        {totals.free_throws_attempted > 0 ? 
                            `(${((totals.free_throws_made / totals.free_throws_attempted) * 100).toFixed(1)}%)` : 
                            '(0.0%)'
                        }
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">{totals.rebounds}</div>
                    <div className="text-gray-400">Rebounds</div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">{totals.assists}</div>
                    <div className="text-gray-400">Assists</div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">{totals.steals}</div>
                    <div className="text-gray-400">Steals</div>
                </div>
                <div className="text-center">
                    <div className="text-lg text-white">{totals.blocks}</div>
                    <div className="text-gray-400">Blocks</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f0f1e] text-white">
            <Head title={`${teamA?.name || 'Team A'} vs ${teamB?.name || 'Team B'} - Game Detail`} />
            
            {/* Header */}
            <div className="bg-[#1a1a2e] border-b border-[#16213e]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Schedule
                    </Link>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {teamA?.name || 'Team A'} vs {teamB?.name || 'Team B'}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {gameDateTime.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {gameDateTime.time}
                                </div>
                                {game.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {game.location}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-[#1a1a2e] rounded-lg p-8 border border-[#16213e] mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
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