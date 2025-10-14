import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, Users, Trophy, Calendar, MapPin, Clock } from 'lucide-react';

export default function TeamDetail({ team, games, activeLeague }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50 text-slate-800">
            <Head title={`${team.name} - Team Detail`} />
            
            {/* Header */}
            <div className="bg-white/90 border-b border-orange-200 shadow-sm backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors mb-4 font-medium"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Teams
                    </Link>
                    
                    <div className="flex items-start gap-3 lg:gap-4">
                        <div className="p-2 lg:p-3 bg-orange-100 rounded-full flex-shrink-0">
                            <Users className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl lg:text-3xl font-bold text-slate-800">{team.name}</h1>
                            <div className="text-sm lg:text-base text-slate-600">
                                <div>
                                    {activeLeague ? activeLeague.name : team.leagues?.map(league => league.name).join(', ') || 'No leagues assigned'}
                                </div>
                                {team.coach && (
                                    <div className="mt-1">
                                        Coach: {team.coach.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
                {/* Player Statistics Table */}
                <div className="bg-white rounded-lg p-3 lg:p-6 border border-slate-200 shadow-lg mb-6 lg:mb-8">
                    <h2 className="text-lg lg:text-2xl font-bold text-slate-800 mb-4 lg:mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 lg:h-6 lg:w-6 text-orange-500" />
                        Player Statistics - {activeLeague?.name || 'Season'}
                    </h2>
                    
                    {team.players && team.players.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[30px]">#</th>
                                        <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[100px]">Player</th>
                                        <th className="text-left py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[40px] hidden sm:table-cell">Pos</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[35px]">GP</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[40px]">PPG</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[40px]">RPG</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[40px]">APG</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[40px] hidden md:table-cell">SPG</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[40px] hidden md:table-cell">BPG</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[45px] hidden lg:table-cell">FG%</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[45px] hidden lg:table-cell">3P%</th>
                                        <th className="text-center py-2 sm:py-3 px-1 sm:px-2 text-slate-600 font-medium min-w-[45px] hidden lg:table-cell">FT%</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {team.players.map((player, index) => {
                                        const averages = player.averages || {};
                                        return (
                                            <tr key={index} className="border-b border-slate-200/50 hover:bg-slate-50 transition-colors">
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-orange-600 font-bold">
                                                    {player.jersey_number || player.number || '--'}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-slate-800 font-medium">
                                                    <div className="min-w-[80px]">
                                                        <div className="font-medium text-slate-800">
                                                            {player.user?.name || 'Unknown Player'}
                                                        </div>
                                                        <div className="text-xs text-slate-600 sm:hidden">
                                                            {player.position || '--'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-slate-700 hidden sm:table-cell">
                                                    {player.position || '--'}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700">
                                                    {averages.games_played || 0}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-orange-600 font-bold">
                                                    {averages.points || 0}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700">
                                                    {averages.rebounds || 0}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700">
                                                    {averages.assists || 0}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700 hidden md:table-cell">
                                                    {averages.steals || 0}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700 hidden md:table-cell">
                                                    {averages.blocks || 0}
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700 hidden lg:table-cell">
                                                    {averages.field_goal_percentage || 0}%
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700 hidden lg:table-cell">
                                                    {averages.three_point_percentage || 0}%
                                                </td>
                                                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center text-slate-700 hidden lg:table-cell">
                                                    {averages.free_throw_percentage || 0}%
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-600">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No players found for this team.</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Team Info */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Users className="h-6 w-6 text-orange-500" />
                            Team Information
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Team Name</label>
                                <div className="text-slate-800 font-medium">{team.name}</div>
                            </div>
                            
                            {team.coach && (
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Coach</label>
                                    <div className="text-slate-800 font-medium">{team.coach.name}</div>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">League</label>
                                <div className="text-slate-800 font-medium">
                                    {activeLeague?.name || team.leagues?.map(league => league.name).join(', ') || 'No leagues assigned'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Players</label>
                                <div className="text-slate-800 font-medium">{team.players?.length || 0}</div>
                            </div>
                            
                            {team.code && (
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Team Code</label>
                                    <div className="text-orange-600 font-mono font-medium">{team.code}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Games */}
                    <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-lg">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
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
                                            className="block p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-slate-600">
                                                        {isHomeTeam ? 'vs' : '@'}
                                                    </span>
                                                    <span className="font-medium text-slate-800">
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
                                            
                                            <div className="flex items-center gap-4 text-sm text-slate-600">
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
                            <div className="text-center py-8 text-slate-600">
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