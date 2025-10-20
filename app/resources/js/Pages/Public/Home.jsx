import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Trophy, Calendar, MapPin, Clock, Award, Users, TrendingUp } from 'lucide-react';
import { PublicNavbar } from '@/Pages/Public/PublicNavbar';
import PublicSchedules from '@/Pages/Public/PublicSchedules';
import PublicTeams from '@/Pages/Public/PublicTeams';

export default function Home({ auth, games, teams, seasons }) {
    const [currentPage, setCurrentPage] = useState('home');

    const handleNavigate = (page) => {
        if (page === 'home') {
            setCurrentPage('home');
        } else if (page === 'schedules') {
            router.visit('/schedules');
        } else if (page === 'teams') {
            router.visit('/public/teams');
        } else if (page === 'leaderboards') {
            router.visit('/leaderboards');
        } else {
            setCurrentPage(page);
        }
    };

    // Get active season
    const activeSeason = seasons?.find(s => s.status === 'active') || seasons?.[0];
    const filteredGames = games?.filter(g => g.league_id === activeSeason?.id) || [];

    // Separate games by status
    const upcomingGames = filteredGames
        .filter(g => g.status === 'scheduled')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    const finishedGames = filteredGames
        .filter(g => g.status === 'completed')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const getTeamName = (teamId) => {
        return teams?.find(t => t.id === teamId)?.name || 'Unknown Team';
    };

    const formatGameTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    };

    const GameCard = ({ game, isFinished = false, showVenue = true }) => {
        const teamA = getTeamName(game.team_a_id);
        const teamB = getTeamName(game.team_b_id);
        const gameTime = formatGameTime(game.date);

        return (
            <Link
                href={`/games/${game.id}`}
                className="block bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all rounded-lg p-4"
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                        {/* Team A */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {teamA.substring(0, 3).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-slate-800 font-medium">{teamA}</span>
                            {isFinished && (
                                <span className="text-lg font-bold text-orange-600 ml-auto">
                                    {game.team_a_score}
                                </span>
                            )}
                        </div>
                        {/* Team B */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                    {teamB.substring(0, 3).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-slate-800 font-medium">{teamB}</span>
                            {isFinished && (
                                <span className="text-lg font-bold text-orange-600 ml-auto">
                                    {game.team_b_score}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="text-right text-sm text-slate-600 ml-4">
                        <div>{gameTime.date}</div>
                        <div>{gameTime.time}</div>
                        {showVenue && game.venue && (
                            <div className="flex items-center gap-1 text-xs mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{game.venue}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        );
    };

    if (currentPage === 'schedules') {
        return (
            <>
                <Head title="Queens Ballers Republiq" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
                    <PublicNavbar currentPage={currentPage} onNavigate={handleNavigate} />
                    <PublicSchedules games={games} teams={teams} seasons={seasons} />
                </div>
            </>
        );
    }

    if (currentPage === 'teams') {
        return (
            <>
                <Head title="Queens Ballers Republiq" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
                    <PublicNavbar currentPage={currentPage} onNavigate={handleNavigate} />
                    <PublicTeams teams={teams} seasons={seasons} />
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Queens Ballers Republiq" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
                <PublicNavbar currentPage={currentPage} onNavigate={handleNavigate} />
                
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-b border-orange-200/50">
                    <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
                        <div className="text-center">
                            {/* Logo */}
                            <div className="flex justify-center mb-8">
                                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                    <Trophy className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                                </div>
                            </div>
                            
                            {/* Brand Title */}
                            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                                    Queens Ballers Republiq
                                </span>
                            </h1>
                            
                            <p className="text-xl lg:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
                                Where champions are made on the court. Experience the excitement of competitive basketball in the heart of Queens.
                            </p>
                            
                            {/* Quick Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => handleNavigate('schedules')}
                                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    View Schedule
                                </button>
                                <button
                                    onClick={() => handleNavigate('leaderboards')}
                                    className="bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                                >
                                    Leaderboards
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-100 to-transparent rounded-full blur-3xl opacity-60"></div>
                </div>

                {/* Game Schedules Section */}
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-8">
                        
                        {/* Upcoming Games */}
                        <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-6 w-6 text-orange-500" />
                                    <h2 className="text-xl font-bold text-slate-800">Upcoming Games</h2>
                                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-medium">
                                        {upcomingGames.length}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {upcomingGames.length > 0 ? (
                                    <>
                                        {upcomingGames.map((game) => (
                                            <GameCard key={game.id} game={game} />
                                        ))}
                                        <div className="pt-4 border-t border-slate-100">
                                            <button
                                                onClick={() => handleNavigate('schedules')}
                                                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
                                            >
                                                View Full Schedule →
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-600 text-center py-8">
                                        No upcoming games scheduled.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Finished Games */}
                        <div className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <Award className="h-6 w-6 text-blue-500" />
                                    <h2 className="text-xl font-bold text-slate-800">Recent Results</h2>
                                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
                                        {finishedGames.length}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                {finishedGames.length > 0 ? (
                                    <>
                                        {finishedGames.map((game) => (
                                            <GameCard key={game.id} game={game} isFinished={true} showVenue={false} />
                                        ))}
                                        <div className="pt-4 border-t border-slate-100">
                                            <button
                                                onClick={() => handleNavigate('schedules')}
                                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                                            >
                                                View All Results →
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-600 text-center py-8">
                                        No completed games yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white rounded-lg p-6 text-center shadow-lg border border-slate-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">{teams?.length || 0}</div>
                            <div className="text-slate-600">Teams</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 text-center shadow-lg border border-slate-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">{filteredGames.length}</div>
                            <div className="text-slate-600">Games</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 text-center shadow-lg border border-slate-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-slate-800 mb-1">{activeSeason?.name || 'Current'}</div>
                            <div className="text-slate-600">Season</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}