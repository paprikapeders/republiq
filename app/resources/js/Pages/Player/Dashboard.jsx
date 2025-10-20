import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { 
    Trophy, 
    Target, 
    Users, 
    Calendar,
    BarChart3,
    Crown,
    TrendingUp,
    Award
} from 'lucide-react'

export default function PlayerDashboard({ 
    auth, 
    playerProfile, 
    teamInfo, 
    recentStats = [],
    mvpCount = 0,
    upcomingGames = []
}) {
    const QuickStatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                    color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    color === 'green' ? 'bg-green-100 text-green-600' :
                    color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
    )

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                        <Trophy className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Player Dashboard
                        </h2>
                        <p className="text-sm text-gray-600">
                            Welcome back, {auth.user.name}!
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Player Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Player Profile Card */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl font-bold">
                                    {playerProfile?.jersey_number || '#'}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-xl font-bold">{auth.user.name}</h1>
                                <div className="flex flex-wrap items-center gap-4 mt-1 text-orange-100">
                                    <span>Team: {teamInfo?.name || 'No Team'}</span>
                                    {playerProfile?.position && <span>Position: {playerProfile.position}</span>}
                                    {mvpCount > 0 && (
                                        <span className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-sm">
                                            <Crown className="h-3 w-3" />
                                            {mvpCount} MVP{mvpCount !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Link
                                href={route('player.stats')}
                                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                View Full Stats
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Quick Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Recent Performance */}
                            {recentStats.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                        Recent Performance
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <QuickStatCard
                                            icon={Target}
                                            title="Avg Points"
                                            value={recentStats.reduce((acc, stat) => acc + stat.points, 0) / recentStats.length}
                                            subtitle={`Last ${recentStats.length} games`}
                                            color="orange"
                                        />
                                        <QuickStatCard
                                            icon={BarChart3}
                                            title="Avg Rebounds"
                                            value={recentStats.reduce((acc, stat) => acc + stat.rebounds, 0) / recentStats.length}
                                            subtitle={`Last ${recentStats.length} games`}
                                            color="green"
                                        />
                                        <QuickStatCard
                                            icon={Users}
                                            title="Avg Assists"
                                            value={recentStats.reduce((acc, stat) => acc + stat.assists, 0) / recentStats.length}
                                            subtitle={`Last ${recentStats.length} games`}
                                            color="blue"
                                        />
                                        <QuickStatCard
                                            icon={Award}
                                            title="Games Played"
                                            value={recentStats.length}
                                            subtitle="This season"
                                            color="purple"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {/* Recent Games */}
                            {recentStats.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-orange-600" />
                                            Recent Games
                                        </h3>
                                        <Link
                                            href={route('player.stats')}
                                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                        >
                                            View All
                                        </Link>
                                    </div>
                                    <div className="space-y-3">
                                        {recentStats.slice(0, 3).map((stat, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900">vs Team Name</p>
                                                    <p className="text-sm text-gray-600">
                                                        {stat.points} PTS • {stat.rebounds} REB • {stat.assists} AST
                                                    </p>
                                                </div>
                                                <div className="text-right text-sm text-gray-600">
                                                    Recent Game
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {recentStats.length === 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Stats Yet</h3>
                                    <p className="text-gray-600 mb-4">
                                        Your game statistics will appear here once you start playing in games.
                                    </p>
                                    {!teamInfo && (
                                        <Link
                                            href={route('teams.index')}
                                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Users className="h-4 w-4" />
                                            Join a Team
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link
                                        href={route('player.stats')}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <BarChart3 className="h-5 w-5 text-orange-600" />
                                        <span className="font-medium">View Full Stats</span>
                                    </Link>
                                    <Link
                                        href={route('teams.index')}
                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        <Users className="h-5 w-5 text-blue-600" />
                                        <span className="font-medium">Team Management</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Team Info */}
                            {teamInfo && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{teamInfo.name}</p>
                                            <p className="text-sm text-gray-600">Your Team</p>
                                        </div>
                                        {playerProfile?.jersey_number && (
                                            <div>
                                                <p className="font-medium text-gray-900">#{playerProfile.jersey_number}</p>
                                                <p className="text-sm text-gray-600">Jersey Number</p>
                                            </div>
                                        )}
                                        {playerProfile?.position && (
                                            <div>
                                                <p className="font-medium text-gray-900">{playerProfile.position}</p>
                                                <p className="text-sm text-gray-600">Position</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Games */}
                            {upcomingGames.length > 0 && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        Upcoming Games
                                    </h3>
                                    <div className="space-y-3">
                                        {upcomingGames.slice(0, 3).map((game, index) => (
                                            <div key={index} className="p-3 bg-blue-50 rounded-lg">
                                                <p className="font-medium text-blue-900">vs Opponent</p>
                                                <p className="text-sm text-blue-700">Date TBD</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}