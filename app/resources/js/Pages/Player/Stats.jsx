import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { 
    Trophy, 
    Target, 
    Users, 
    Calendar, 
    TrendingUp, 
    Award,
    BarChart3,
    Activity,
    Star,
    Crown,
    Medal
} from 'lucide-react'

export default function PlayerStats({ 
    auth, 
    playerProfile, 
    overallStats, 
    gameStats = [], 
    teamInfo, 
    mvpGames = [],
    recentGames = []
}) {
    const [activeTab, setActiveTab] = useState('overview')

    // Calculate averages
    const gamesPlayed = gameStats.length
    const avgPoints = gamesPlayed > 0 ? (overallStats.total_points / gamesPlayed).toFixed(1) : '0.0'
    const avgRebounds = gamesPlayed > 0 ? (overallStats.total_rebounds / gamesPlayed).toFixed(1) : '0.0'
    const avgAssists = gamesPlayed > 0 ? (overallStats.total_assists / gamesPlayed).toFixed(1) : '0.0'
    const avgSteals = gamesPlayed > 0 ? (overallStats.total_steals / gamesPlayed).toFixed(1) : '0.0'
    const avgBlocks = gamesPlayed > 0 ? (overallStats.total_blocks / gamesPlayed).toFixed(1) : '0.0'
    
    const fgPercentage = overallStats.total_field_goal_attempts > 0 
        ? ((overallStats.total_field_goals / overallStats.total_field_goal_attempts) * 100).toFixed(1)
        : '0.0'
    
    const threePercentage = overallStats.total_three_point_attempts > 0 
        ? ((overallStats.total_three_pointers / overallStats.total_three_point_attempts) * 100).toFixed(1)
        : '0.0'
    
    const ftPercentage = overallStats.total_free_throw_attempts > 0 
        ? ((overallStats.total_free_throws / overallStats.total_free_throw_attempts) * 100).toFixed(1)
        : '0.0'

    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', highlight = false }) => (
        <div className={`p-6 rounded-lg border-2 transition-all duration-200 ${
            highlight 
                ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' 
                : 'bg-white border-gray-200 hover:border-gray-300'
        }`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${
                    color === 'orange' ? 'bg-orange-100 text-orange-600' :
                    color === 'green' ? 'bg-green-100 text-green-600' :
                    color === 'purple' ? 'bg-purple-100 text-purple-600' :
                    color === 'red' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                {highlight && <Crown className="h-4 w-4 text-orange-500" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
    )

    const GameStatRow = ({ game, stat }) => {
        const isMVP = mvpGames.some(mvpGame => mvpGame.game_id === game.id)
        
        return (
            <div
                className={`p-4 rounded-lg border ${
                    isMVP 
                        ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200' 
                        : 'bg-white border-gray-200'
                }`}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="text-sm">
                            <p className="font-medium text-gray-900 text-base sm:text-sm">
                                vs {game.team_a_id === teamInfo.id ? game.team_b.name : game.team_a.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {new Date(game.date).toLocaleDateString()} • {game.status}
                            </p>
                        </div>
                        {isMVP && (
                            <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium w-fit">
                                <Crown className="h-3 w-3" />
                                MVP
                            </div>
                        )}
                    </div>
                    <div className="text-left sm:text-right">
                        <div className="text-sm text-gray-600">Final Score</div>
                        <div className="font-bold text-lg sm:font-medium sm:text-base">
                            {game.team_a_score} - {game.team_b_score}
                        </div>
                    </div>
                </div>
                
                {/* Mobile: Horizontal scroll for stats */}
                <div className="block sm:hidden">
                    <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-max px-2">
                            <div className="text-center min-w-[50px]">
                                <div className="text-lg font-bold text-orange-600 mb-1">{stat.points}</div>
                                <div className="text-xs text-gray-600">PTS</div>
                            </div>
                            <div className="text-center min-w-[50px]">
                                <div className="text-lg font-bold text-gray-900 mb-1">{stat.rebounds}</div>
                                <div className="text-xs text-gray-600">REB</div>
                            </div>
                            <div className="text-center min-w-[50px]">
                                <div className="text-lg font-bold text-gray-900 mb-1">{stat.assists}</div>
                                <div className="text-xs text-gray-600">AST</div>
                            </div>
                            <div className="text-center min-w-[50px]">
                                <div className="text-lg font-bold text-gray-900 mb-1">{stat.steals}</div>
                                <div className="text-xs text-gray-600">STL</div>
                            </div>
                            <div className="text-center min-w-[50px]">
                                <div className="text-lg font-bold text-gray-900 mb-1">{stat.blocks}</div>
                                <div className="text-xs text-gray-600">BLK</div>
                            </div>
                            <div className="text-center min-w-[60px]">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                    {stat.field_goals_made}/{stat.field_goals_attempted}
                                </div>
                                <div className="text-xs text-gray-600">FG</div>
                            </div>
                            <div className="text-center min-w-[60px]">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                    {stat.three_pointers_made}/{stat.three_pointers_attempted}
                                </div>
                                <div className="text-xs text-gray-600">3PT</div>
                            </div>
                            <div className="text-center min-w-[60px]">
                                <div className="text-sm font-medium text-gray-900 mb-1">
                                    {stat.free_throws_made}/{stat.free_throws_attempted}
                                </div>
                                <div className="text-xs text-gray-600">FT</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Desktop: Grid layout */}
                <div className="hidden sm:grid grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                    <div className="p-2">
                        <div className="text-lg font-bold text-orange-600">{stat.points}</div>
                        <div className="text-xs text-gray-600">PTS</div>
                    </div>
                    <div className="p-2">
                        <div className="text-lg font-bold text-gray-900">{stat.rebounds}</div>
                        <div className="text-xs text-gray-600">REB</div>
                    </div>
                    <div className="p-2">
                        <div className="text-lg font-bold text-gray-900">{stat.assists}</div>
                        <div className="text-xs text-gray-600">AST</div>
                    </div>
                    <div className="p-2">
                        <div className="text-lg font-bold text-gray-900">{stat.steals}</div>
                        <div className="text-xs text-gray-600">STL</div>
                    </div>
                    <div className="p-2 hidden lg:block">
                        <div className="text-lg font-bold text-gray-900">{stat.blocks}</div>
                        <div className="text-xs text-gray-600">BLK</div>
                    </div>
                    <div className="p-2 hidden lg:block">
                        <div className="text-sm font-medium text-gray-900">
                            {stat.field_goals_made}/{stat.field_goals_attempted}
                        </div>
                        <div className="text-xs text-gray-600">FG</div>
                    </div>
                    <div className="p-2 hidden lg:block">
                        <div className="text-sm font-medium text-gray-900">
                            {stat.three_pointers_made}/{stat.three_pointers_attempted}
                        </div>
                        <div className="text-xs text-gray-600">3PT</div>
                    </div>
                    <div className="p-2 hidden lg:block">
                        <div className="text-sm font-medium text-gray-900">
                            {stat.free_throws_made}/{stat.free_throws_attempted}
                        </div>
                        <div className="text-xs text-gray-600">FT</div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            My Basketball Stats
                        </h2>
                        <p className="text-sm text-gray-600">
                            Track your performance and game statistics
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Player Stats" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Player Profile Card */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 sm:p-6 text-white">
                        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xl sm:text-2xl font-bold">
                                    {playerProfile?.jersey_number || '#'}
                                </span>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">{auth.user.name}</h1>
                                <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-2 sm:gap-4 mt-2 text-orange-100 text-sm">
                                    <span>Team: {teamInfo?.name || 'No Team'}</span>
                                    {playerProfile?.position && <span>Position: {playerProfile.position}</span>}
                                    <span>Games Played: {gamesPlayed}</span>
                                    {mvpGames.length > 0 && (
                                        <span className="flex items-center justify-center sm:justify-start gap-1 bg-white/20 px-2 py-1 rounded-full w-fit mx-auto sm:mx-0">
                                            <Crown className="h-4 w-4" />
                                            {mvpGames.length} MVP{mvpGames.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex overflow-x-auto px-4 sm:px-6">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                                        activeTab === 'overview'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Trophy className="h-4 w-4" />
                                        <span className="hidden sm:inline">Overview</span>
                                        <span className="sm:hidden">Stats</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('games')}
                                    className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ml-4 sm:ml-8 ${
                                        activeTab === 'games'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span className="hidden sm:inline">Game by Game</span>
                                        <span className="sm:hidden">Games</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('achievements')}
                                    className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ml-4 sm:ml-8 ${
                                        activeTab === 'achievements'
                                            ? 'border-orange-500 text-orange-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4" />
                                        <span className="hidden sm:inline">Achievements</span>
                                        <span className="sm:hidden">Awards</span>
                                    </div>
                                </button>
                            </nav>
                        </div>

                        <div className="p-4 sm:p-6">
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    {/* Season Averages */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-orange-600" />
                                            Season Averages
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <StatCard
                                                icon={Target}
                                                title="Points Per Game"
                                                value={avgPoints}
                                                color="orange"
                                                highlight={parseFloat(avgPoints) >= 20}
                                            />
                                            <StatCard
                                                icon={Activity}
                                                title="Rebounds Per Game"
                                                value={avgRebounds}
                                                color="green"
                                            />
                                            <StatCard
                                                icon={Users}
                                                title="Assists Per Game"
                                                value={avgAssists}
                                                color="blue"
                                            />
                                            <StatCard
                                                icon={Trophy}
                                                title="Games Played"
                                                value={gamesPlayed}
                                                color="purple"
                                            />
                                        </div>
                                    </div>

                                    {/* Shooting Stats */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Target className="h-5 w-5 text-orange-600" />
                                            Shooting Efficiency
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <StatCard
                                                icon={Target}
                                                title="Field Goal %"
                                                value={`${fgPercentage}%`}
                                                subtitle={`${overallStats.total_field_goals}/${overallStats.total_field_goal_attempts}`}
                                                color="blue"
                                            />
                                            <StatCard
                                                icon={Target}
                                                title="Three Point %"
                                                value={`${threePercentage}%`}
                                                subtitle={`${overallStats.total_three_pointers}/${overallStats.total_three_point_attempts}`}
                                                color="green"
                                            />
                                            <StatCard
                                                icon={Target}
                                                title="Free Throw %"
                                                value={`${ftPercentage}%`}
                                                subtitle={`${overallStats.total_free_throws}/${overallStats.total_free_throw_attempts}`}
                                                color="purple"
                                            />
                                        </div>
                                    </div>

                                    {/* Additional Stats */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-orange-600" />
                                            Defensive & Other Stats
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <StatCard
                                                icon={Activity}
                                                title="Steals Per Game"
                                                value={avgSteals}
                                                color="red"
                                            />
                                            <StatCard
                                                icon={Activity}
                                                title="Blocks Per Game"
                                                value={avgBlocks}
                                                color="red"
                                            />
                                            <StatCard
                                                icon={Award}
                                                title="Total Turnovers"
                                                value={overallStats.total_turnovers || 0}
                                                color="red"
                                            />
                                            <StatCard
                                                icon={Award}
                                                title="Total Fouls"
                                                value={overallStats.total_fouls || 0}
                                                color="red"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'games' && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Calendar className="h-5 w-5 text-orange-600" />
                                            Game Statistics
                                        </h3>
                                        <div className="text-sm text-gray-600">
                                            {gameStats.length} game{gameStats.length !== 1 ? 's' : ''} played
                                        </div>
                                    </div>

                                    {gameStats.length > 0 ? (
                                        <div className="space-y-3">
                                            {gameStats.map((stat) => (
                                                <GameStatRow 
                                                    key={stat.id} 
                                                    game={stat.game} 
                                                    stat={stat}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 text-gray-500">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No game statistics available yet.</p>
                                            <p className="text-sm">Your stats will appear here after playing in games.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'achievements' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-orange-600" />
                                        Achievements & Highlights
                                    </h3>

                                    {/* MVP Games */}
                                    {mvpGames.length > 0 && (
                                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6">
                                            <h4 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                                                <Crown className="h-5 w-5" />
                                                MVP Performances ({mvpGames.length})
                                            </h4>
                                            <div className="grid gap-3">
                                                {mvpGames.map((mvpGame) => (
                                                    <div key={mvpGame.id} className="bg-white rounded-lg p-4 border border-orange-200">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    MVP vs {mvpGame.game.team_a_id === teamInfo.id 
                                                                        ? mvpGame.game.team_b.name 
                                                                        : mvpGame.game.team_a.name}
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(mvpGame.game.date).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <Medal className="h-6 w-6 text-orange-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Personal Bests */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                                <Star className="h-4 w-4" />
                                                Most Points in a Game
                                            </h4>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {Math.max(...gameStats.map(g => g.points), 0)}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                                <Star className="h-4 w-4" />
                                                Most Rebounds in a Game
                                            </h4>
                                            <p className="text-2xl font-bold text-green-600">
                                                {Math.max(...gameStats.map(g => g.rebounds), 0)}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                                <Star className="h-4 w-4" />
                                                Most Assists in a Game
                                            </h4>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {Math.max(...gameStats.map(g => g.assists), 0)}
                                            </p>
                                        </div>
                                    </div>

                                    {mvpGames.length === 0 && gameStats.length === 0 && (
                                        <div className="text-center py-12 text-gray-500">
                                            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No achievements yet.</p>
                                            <p className="text-sm">Keep playing to unlock achievements and track your progress!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}