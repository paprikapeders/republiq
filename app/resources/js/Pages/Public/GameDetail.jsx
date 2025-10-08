import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Calendar, MapPin, Trophy, Users, Clock } from 'lucide-react';

export default function GameDetail({ game }) {
    
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

        teamStats.forEach(player => {
            if (player && player.stats) {
                const playerPoints = parseInt(player.stats.points) || 0;
                const threePointers = parseInt(player.stats.three_pointers) || 0;
                const twoPointers = parseInt(player.stats.two_pointers) || 0;
                const freeThrows = parseInt(player.stats.free_throws) || 0;
                
                // Calculate total points from individual stat types if main points is 0
                const calculatedPoints = playerPoints > 0 ? playerPoints : (threePointers * 3) + (twoPointers * 2) + freeThrows;
                
                totals.points += calculatedPoints;
                totals.threePointers += threePointers;
                totals.twoPointers += twoPointers;
                totals.freeThrows += freeThrows;
                totals.rebounds += parseInt(player.stats.rebounds) || 0;
                totals.assists += parseInt(player.stats.assists) || 0;
                totals.fouls += parseInt(player.stats.fouls) || 0;
                
            }
        });

        return totals;
    };    const homeTeamTotals = calculateTeamTotals(homeTeamStats);
    const awayTeamTotals = calculateTeamTotals(awayTeamStats);
    
    // Use calculated player stats if available, otherwise use saved game scores
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