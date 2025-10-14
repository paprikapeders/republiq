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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Game Schedule</h1>
                    <p className="text-slate-600">{activeSeason?.name || 'Current Season'}</p>
                </div>

                {/* Games List */}
                <div className="space-y-6">
                    {Object.entries(gamesByDate).map(([date, dateGames]) => (
                        <div key={date}>
                            {/* Date Header */}
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar className="h-5 w-5 text-orange-500" />
                                <h2 className="text-lg font-semibold text-slate-800">{date}</h2>
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
                                            className="block bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all rounded-lg p-5 shadow-sm"
                                        >
                                            <div className="grid grid-cols-3 gap-4 items-center">
                                                {/* Column 1: Game (Teams) */}
                                                <div className="space-y-3">
                                                    {/* Team A */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
                                                            <span className="text-white font-bold text-xs">
                                                                {teamA.substring(0, 3).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-slate-800 font-medium truncate">{teamA}</span>
                                                    </div>
                                                    {/* Team B */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                                                            <span className="text-white font-bold text-xs">
                                                                {teamB.substring(0, 3).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="text-slate-800 font-medium truncate">{teamB}</span>
                                                    </div>
                                                </div>

                                                {/* Column 2: Venue */}
                                                <div className="text-center space-y-2">
                                                    {getStatusBadge(game.status)}
                                                    <div className="text-sm text-slate-600">{time}</div>
                                                    <div className="flex items-center gap-1 text-xs text-slate-600 justify-center">
                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate" title={game.venue || 'Main Court'}>
                                                            {game.venue || 'Main Court'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Column 3: Score */}
                                                <div className="text-right">
                                                    {game.status === 'completed' ? (
                                                        <div className="space-y-3">
                                                            <div className="text-xl font-bold text-orange-600">
                                                                {game.team_a_score}
                                                            </div>
                                                            <div className="text-xl font-bold text-orange-600">
                                                                {game.team_b_score}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-slate-600">
                                                            {game.status === 'in_progress' ? (
                                                                <span className="text-orange-600 font-medium">LIVE</span>
                                                            ) : (
                                                                <span>vs</span>
                                                            )}
                                                        </div>
                                                    )}
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
                    <div className="bg-white border border-slate-200 p-12 text-center rounded-lg shadow-lg">
                        <p className="text-slate-600">No games scheduled for this season yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}