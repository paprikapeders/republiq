import React from 'react';
import { ArrowLeft, Calendar, MapPin, Trophy } from 'lucide-react';

export function PublicGameDetail({ game, teams, onBack }) {
    const teamA = teams?.find(t => t.id === game.team_a_id);
    const teamB = teams?.find(t => t.id === game.team_b_id);
    
    const date = new Date(game.date).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    const time = new Date(game.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="min-h-screen bg-[#0f0f1e]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Schedule
                </button>

                {/* Game Header */}
                <div className="bg-[#1a1a2e] border border-[#16213e] mb-6 rounded-lg">
                    <div className="p-8">
                        {/* Game Info */}
                        <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{game.venue || 'Main Court'}</span>
                            </div>
                            {game.status === 'completed' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                                    Final
                                </span>
                            )}
                        </div>

                        {/* Scoreboard */}
                        <div className="grid grid-cols-3 gap-8 items-center">
                            {/* Team A */}
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-white font-bold text-2xl">
                                        {teamA?.name?.substring(0, 3).toUpperCase() || 'TMA'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{teamA?.name || 'Team A'}</h2>
                                {game.status === 'completed' && (
                                    <div className="text-5xl font-bold text-white mt-4">{game.team_a_score || 0}</div>
                                )}
                            </div>

                            {/* VS Divider */}
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-500">VS</div>
                            </div>

                            {/* Team B */}
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-white font-bold text-2xl">
                                        {teamB?.name?.substring(0, 3).toUpperCase() || 'TMB'}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{teamB?.name || 'Team B'}</h2>
                                {game.status === 'completed' && (
                                    <div className="text-5xl font-bold text-white mt-4">{game.team_b_score || 0}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {game.status === 'scheduled' && (
                    <div className="bg-[#1a1a2e] border border-[#16213e] p-12 text-center rounded-lg">
                        <p className="text-gray-400">Game statistics will be available after the game is completed.</p>
                    </div>
                )}

                {game.status === 'completed' && (
                    <div className="bg-[#1a1a2e] border border-[#16213e] p-12 text-center rounded-lg">
                        <p className="text-gray-400">Detailed statistics coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}