import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Users } from 'lucide-react';
import { PublicNavbar } from '@/Pages/Public/PublicNavbar';

function PublicTeams({ teams, seasons }) {
    
    const activeSeason = seasons?.find(s => s.status === 'active' || s.is_active === true) || seasons?.[0];
    
    // Filter teams that belong to the active league
    const filteredTeams = teams?.filter(team => {
        if (!activeSeason) return true; // Show all teams if no active season
        return team.leagues?.some(league => league.id === activeSeason.id);
    }) || [];

    return (
        <>
            <Head title="Teams - Queens Ballers Republiq" />
            <PublicNavbar currentPage="teams" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Teams</h1>
                    <p className="text-slate-600">{activeSeason?.name || 'Current Season'}</p>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team, index) => {
                        // Alternate between different gradient colors for variety
                        const gradients = [
                            'from-orange-500 to-orange-600',
                            'from-blue-500 to-blue-600',
                            'from-green-500 to-green-600',
                            'from-purple-500 to-purple-600',
                        ];
                        const gradient = gradients[index % gradients.length];

                        return (
                            <Link
                                key={team.id}
                                href={`/teams/${team.id}`}
                                className="block bg-white border border-slate-200 hover:border-orange-300 transition-all overflow-hidden group rounded-lg shadow-sm hover:shadow-md"
                            >
                                {/* Team Header with Gradient */}
                                <div className={`bg-gradient-to-br ${gradient} p-8 relative`}>
                                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-white font-bold text-xl">
                                                {team.name?.substring(0, 3).toUpperCase() || 'TM'}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{team.name}</h3>
                                        <p className="text-white/70 text-sm">
                                            {team.players?.length || 0} Players
                                            {team.coach && ` • Coach: ${team.coach.name}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Team Body */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-600 group-hover:text-orange-600 transition-colors">
                                            <Users className="h-5 w-5" />
                                            <span>View Team Details →</span>
                                        </div>
                                        {team.leagues?.[0] && (
                                            <div className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                {team.leagues[0].name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {filteredTeams.length === 0 && (
                    <div className="bg-white border border-slate-200 p-12 text-center rounded-lg shadow-sm">
                        <p className="text-slate-600">No teams registered for this season yet.</p>
                    </div>
                )}
                </div>
            </div>
        </>
    );
}

export default PublicTeams;