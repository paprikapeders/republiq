import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';

export function PublicTeamRoster({ team, onBack }) {
    // Get team color based on team name
    const getTeamGradient = () => {
        const name = team.name?.toLowerCase() || '';
        if (name.includes('manila') || name.includes('warriors')) return 'from-orange-500 to-orange-600';
        if (name.includes('cebu') || name.includes('dragons')) return 'from-blue-500 to-blue-600';
        if (name.includes('davao') || name.includes('eagles')) return 'from-green-500 to-green-600';
        if (name.includes('iloilo') || name.includes('sharks')) return 'from-purple-500 to-purple-600';
        return 'from-orange-500 to-orange-600';
    };

    // Mock players data for demo - in real app this would come from the team.players relationship
    const players = team.players || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 text-slate-600 hover:text-slate-800 flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Teams
                </button>

                {/* Team Header */}
                <div className="bg-white border border-slate-200 mb-8 overflow-hidden rounded-lg shadow-sm">
                    <div className={`bg-gradient-to-br ${getTeamGradient()} p-8 relative`}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="relative flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-3xl">
                                    {team.name?.substring(0, 3).toUpperCase() || 'TM'}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{team.name}</h1>
                                <div className="flex items-center gap-4 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        <span>{players.length} Players</span>
                                    </div>
                                    <div>Team Code: {team.code}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Roster Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Roster</h2>
                    <p className="text-slate-600">Team members</p>
                </div>

                {/* Players Grid */}
                {players.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {players.map((player) => (
                            <div key={player.id} className="bg-white border border-slate-200 overflow-hidden rounded-lg shadow-sm">
                                {/* Player Image Placeholder */}
                                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-bold text-2xl">
                                                {player.user?.name?.charAt(0).toUpperCase() || 'P'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Player Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                                        {player.user?.name || 'Unknown Player'}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-4">#{player.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 p-12 text-center rounded-lg shadow-sm">
                        <p className="text-slate-600">No players registered for this team yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}