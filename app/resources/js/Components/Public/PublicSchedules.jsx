import React from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, MapPin } from 'lucide-react';

export function PublicSchedules({ games, teams, seasons }) {
    
    const activeSeason = seasons?.find(s => s.status === 'active') || seasons?.[0];
    const filteredGames = games?.filter(g => g.league_id === activeSeason?.id) || [];

    // Group games by date
    const gamesByDate = filteredGames.reduce((acc, game) => {
        const date = new Date(game.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(game);
        return acc;
    }, {});

    const getTeamName = (teamId) => {
        return teams?.find(t => t.id === teamId)?.name || 'Unknown Team';
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                        Final
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 border border-orange-500/20">
                        Live
                    </span>
                );
            case 'scheduled':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                        Scheduled
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f1e]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Game Schedule</h1>
                    <p className="text-gray-400">{activeSeason?.name || 'Current Season'}</p>
                </div>

                {/* Games List */}
                <div className="space-y-6">
                    {Object.entries(gamesByDate).map(([date, dateGames]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5 text-orange-500" />
                                <h2 className="text-lg font-semibold text-white">{date}</h2>
                            </div>

                            {/* Games for this date */}
                            <div className="space-y-3">
                                {dateGames.map((game) => {
                                    const teamA = getTeamName(game.team_a_id);
                                    const teamB = getTeamName(game.team_b_id);
                                    const time = new Date(game.date).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                    });

                                    return (
                                        <Link
                                            key={game.id}
                                            href={`/games/${game.id}`}
                                            className="block bg-[#1a1a2e] border border-[#16213e] hover:border-orange-500/30 transition-all rounded-lg p-5"
                                        >
                                            <div className="flex items-center justify-between">
                                                {/* Teams and Scores */}
                                                <div className="flex-1">
                                                    {/* Team A */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">
                                                                    {teamA.substring(0, 3).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-white font-medium">{teamA}</span>
                                                        </div>
                                                        {game.status === 'completed' && (
                                                            <span className="text-2xl font-bold text-white ml-4">
                                                                {game.team_a_score}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Team B */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                                                                <span className="text-white font-bold text-sm">
                                                                    {teamB.substring(0, 3).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-white font-medium">{teamB}</span>
                                                        </div>
                                                        {game.status === 'completed' && (
                                                            <span className="text-2xl font-bold text-white ml-4">
                                                                {game.team_b_score}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Game Info */}
                                                <div className="ml-8 text-right space-y-2">
                                                    {getStatusBadge(game.status)}
                                                    <div className="text-sm text-gray-400">{time}</div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>{game.venue || 'Main Court'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="bg-[#1a1a2e] border border-[#16213e] p-12 text-center rounded-lg">
                        <p className="text-gray-400">No games scheduled for this season yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}