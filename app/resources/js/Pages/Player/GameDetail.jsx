import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { 
    Trophy, 
    Target, 
    Calendar, 
    ArrowLeft,
    Crown,
    Users,
    BarChart3,
    Activity
} from 'lucide-react'

export default function GameDetail({ 
    auth, 
    game, 
    playerStat, 
    playerProfile, 
    isMVP 
}) {
    const isTeamA = game.team_a_id === playerProfile.team_id
    const opponentTeam = isTeamA ? game.team_b : game.team_a
    const playerTeam = isTeamA ? game.team_a : game.team_b
    
    const gameResult = () => {
        if (game.status !== 'completed') {
            return { result: 'In Progress', color: 'text-yellow-600' }
        }
        
        const teamScore = isTeamA ? game.team_a_score : game.team_b_score
        const opponentScore = isTeamA ? game.team_b_score : game.team_a_score
        
        if (teamScore > opponentScore) {
            return { result: 'Win', color: 'text-green-600' }
        } else if (teamScore < opponentScore) {
            return { result: 'Loss', color: 'text-red-600' }
        } else {
            return { result: 'Tie', color: 'text-gray-600' }
        }
    }

    const StatBox = ({ label, value, color = 'blue', large = false }) => (
        <div className="text-center">
            <div className={`${large ? 'text-2xl' : 'text-lg'} font-bold ${
                color === 'orange' ? 'text-orange-600' :
                color === 'green' ? 'text-green-600' :
                color === 'purple' ? 'text-purple-600' :
                color === 'red' ? 'text-red-600' :
                'text-blue-600'
            }`}>
                {value}
            </div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    )

    const result = gameResult()

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                        <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Game Performance
                        </h2>
                        <p className="text-sm text-gray-600">
                            Your statistics for this game
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Game vs ${opponentTeam.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Back Button */}
                    <Link
                        href={route('player.stats')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to My Stats
                    </Link>

                    {/* Game Header */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className={`p-6 ${isMVP ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-50'} ${isMVP ? 'text-white' : 'text-gray-900'}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-2xl font-bold">
                                            {playerTeam.name} vs {opponentTeam.name}
                                        </h1>
                                        {isMVP && (
                                            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                                <Crown className="h-4 w-4" />
                                                MVP
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex items-center gap-4 text-sm ${isMVP ? 'text-orange-100' : 'text-gray-600'}`}>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(game.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                        <span>Status: {game.status.charAt(0).toUpperCase() + game.status.slice(1)}</span>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="text-3xl font-bold mb-1">
                                        {game.team_a_score} - {game.team_b_score}
                                    </div>
                                    <div className={`font-medium ${result.color}`}>
                                        {result.result}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Player Performance Summary */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-orange-600" />
                                Your Performance
                            </h3>
                            
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <StatBox label="Points" value={playerStat.points} color="orange" large />
                                <StatBox label="Rebounds" value={playerStat.rebounds} color="green" />
                                <StatBox label="Assists" value={playerStat.assists} color="blue" />
                                <StatBox label="Steals" value={playerStat.steals} color="purple" />
                            </div>
                        </div>
                    </div>

                    {/* Detailed Statistics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <Target className="h-5 w-5 text-orange-600" />
                            Detailed Statistics
                        </h3>
                        
                        <div className="grid gap-6">
                            {/* Shooting Stats */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Shooting</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-blue-600">
                                                {playerStat.field_goals_made}/{playerStat.field_goals_attempted}
                                            </div>
                                            <div className="text-sm text-gray-600">Field Goals</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {playerStat.field_goals_attempted > 0 
                                                    ? `${((playerStat.field_goals_made / playerStat.field_goals_attempted) * 100).toFixed(1)}%`
                                                    : '0.0%'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-green-600">
                                                {playerStat.three_pointers_made}/{playerStat.three_pointers_attempted}
                                            </div>
                                            <div className="text-sm text-gray-600">Three Pointers</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {playerStat.three_pointers_attempted > 0 
                                                    ? `${((playerStat.three_pointers_made / playerStat.three_pointers_attempted) * 100).toFixed(1)}%`
                                                    : '0.0%'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-purple-600">
                                                {playerStat.free_throws_made}/{playerStat.free_throws_attempted}
                                            </div>
                                            <div className="text-sm text-gray-600">Free Throws</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {playerStat.free_throws_attempted > 0 
                                                    ? `${((playerStat.free_throws_made / playerStat.free_throws_attempted) * 100).toFixed(1)}%`
                                                    : '0.0%'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Other Stats */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-3">Other Statistics</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <StatBox label="Blocks" value={playerStat.blocks} color="red" />
                                    <StatBox label="Turnovers" value={playerStat.turnovers || 0} color="red" />
                                    <StatBox label="Fouls" value={playerStat.fouls || 0} color="red" />
                                    <StatBox label="Minutes" value={playerStat.minutes_played || 'N/A'} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game Context */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="h-5 w-5 text-orange-600" />
                            Game Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Your Team</h4>
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="font-medium text-blue-900">{playerTeam.name}</div>
                                    <div className="text-sm text-blue-700">
                                        Score: {isTeamA ? game.team_a_score : game.team_b_score}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Opponent</h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="font-medium text-gray-900">{opponentTeam.name}</div>
                                    <div className="text-sm text-gray-700">
                                        Score: {isTeamA ? game.team_b_score : game.team_a_score}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isMVP && (
                            <div className="mt-6 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <Crown className="h-6 w-6 text-orange-600" />
                                    <div>
                                        <h4 className="font-semibold text-orange-900">Most Valuable Player</h4>
                                        <p className="text-sm text-orange-800">
                                            Congratulations! You were named MVP of this game for your outstanding performance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}