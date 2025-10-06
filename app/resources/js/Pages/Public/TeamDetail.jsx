import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Users, Trophy, Calendar, MapPin, Clock } from 'lucide-react';

export default function TeamDetail({ team, games, activeLeague }) {
    return (
        <div className="min-h-screen bg-[#0f0f1e] text-white">
            <Head title={`${team.name} - Team Detail`} />
            
            {/* Header */}
            <div className="bg-[#1a1a2e] border-b border-[#16213e]">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-4"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Teams
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <Users className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                            <div className="text-gray-400">
                                {activeLeague ? activeLeague.name : team.leagues?.map(league => league.name).join(', ') || 'No leagues assigned'}
                                {team.coach && (
                                    <span className="ml-4">• Coach: {team.coach.name}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Player Statistics Table */}
                <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#16213e] mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Users className="h-6 w-6 text-orange-500" />
                        Player Statistics - {activeLeague?.name || 'Season'}
                    </h2>
                    
                    {team.players && team.players.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#16213e]">
                                        <th className="text-left py-3 px-2 text-gray-300 font-medium">#</th>
                                        <th className="text-left py-3 px-2 text-gray-300 font-medium">Player</th>
                                        <th className="text-left py-3 px-2 text-gray-300 font-medium">Position</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">GP</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">PPG</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">RPG</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">APG</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">SPG</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">BPG</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">FG%</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">3P%</th>
                                        <th className="text-center py-3 px-2 text-gray-300 font-medium">FT%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.players.map((player, index) => {
                                        const averages = player.averages || {};
                                        return (
                                            <tr key={index} className="border-b border-[#16213e]/50 hover:bg-[#0f0f1e] transition-colors">
                                                <td className="py-3 px-2 text-orange-400 font-bold">
                                                    {player.jersey_number || player.number || '--'}
                                                </td>
                                                <td className="py-3 px-2 text-white font-medium">
                                                    {player.user?.name || 'Unknown Player'}
                                                </td>
                                                <td className="py-3 px-2 text-gray-300">
                                                    {player.position || '--'}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.games_played || 0}
                                                </td>
                                                <td className="py-3 px-2 text-center text-orange-400 font-bold">
                                                    {averages.points || 0}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.rebounds || 0}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.assists || 0}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.steals || 0}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.blocks || 0}
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.field_goal_percentage || 0}%
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.three_point_percentage || 0}%
                                                </td>
                                                <td className="py-3 px-2 text-center text-gray-300">
                                                    {averages.free_throw_percentage || 0}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No players found for this team.</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Team Info */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#16213e]">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users className="h-6 w-6 text-orange-500" />
                            Team Information
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Team Name</label>
                                <div className="text-white font-medium">{team.name}</div>
                            </div>
                            
                            {team.coach && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Coach</label>
                                    <div className="text-white font-medium">{team.coach.name}</div>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">League</label>
                                <div className="text-white font-medium">
                                    {activeLeague?.name || team.leagues?.map(league => league.name).join(', ') || 'No leagues assigned'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Players</label>
                                <div className="text-white font-medium">{team.players?.length || 0}</div>
                            </div>
                            
                            {team.code && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Team Code</label>
                                    <div className="text-orange-400 font-mono font-medium">{team.code}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Games */}
                    <div className="bg-[#1a1a2e] rounded-lg p-6 border border-[#16213e]">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-orange-500" />
                            Recent Games
                        </h2>
                        
                        {games && games.length > 0 ? (
                            <div className="space-y-4">
                                {games.map((game, index) => {
                                    const isHomeTeam = game.team_a_id === team.id;
                                    const opponent = isHomeTeam ? game.teamB : game.teamA;
                                    const gameDate = new Date(game.date);
                                    const isCompleted = game.status === 'completed';
                                    
                                    return (
                                        <Link
                                            key={index}
                                            href={`/games/${game.id}`}
                                            className="block p-4 bg-[#0f0f1e] rounded-lg border border-[#16213e]/50 hover:border-orange-500/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-400">
                                                        {isHomeTeam ? 'vs' : '@'}
                                                    </span>
                                                    <span className="font-medium text-white">
                                                        {opponent?.name}
                                                    </span>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    isCompleted 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {isCompleted ? 'Completed' : 'Scheduled'}
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {gameDate.toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {gameDate.toLocaleTimeString('en-US', { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                </div>
                                                {game.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {game.location}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No recent games found for this team.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}