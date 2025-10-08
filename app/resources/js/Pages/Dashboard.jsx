import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Trophy, Shield, Target, Users, Zap, Settings, BarChart3, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard({ auth, redirectMessage, availableFeatures, flash }) {
    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="h-6 w-6 text-red-600" />
            case 'coach': return <Target className="h-6 w-6 text-blue-600" />
            case 'player': return <Users className="h-6 w-6 text-orange-600" />
            case 'referee': return <Zap className="h-6 w-6 text-yellow-600" />
            case 'committee': return <Shield className="h-6 w-6 text-purple-600" />
            default: return <Trophy className="h-6 w-6 text-gray-600" />
        }
    }

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'text-red-600 bg-red-50 border-red-200'
            case 'coach': return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'player': return 'text-orange-600 bg-orange-50 border-orange-200'
            case 'referee': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'committee': return 'text-purple-600 bg-purple-50 border-purple-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getQuickActions = (role) => {
        switch (role) {
            case 'admin':
                return [
                    { label: 'Manage Teams', href: route('teams.index'), icon: Users },
                    { label: 'User Management', href: '#', icon: Settings },
                    { label: 'League Settings', href: '#', icon: BarChart3 }
                ];
            case 'coach':
                return [
                    { label: 'Team Management', href: route('teams.index'), icon: Users },
                    { label: 'Game Stats', href: '#', icon: BarChart3 },
                    { label: 'Schedule', href: '#', icon: Calendar }
                ];
            case 'referee':
                return [
                    { label: 'Enter Stats', href: '#', icon: BarChart3 },
                    { label: 'Match Schedule', href: '#', icon: Calendar }
                ];
            case 'player':
                return [
                    { label: 'Join Team', href: route('teams.index'), icon: Users },
                    { label: 'My Stats', href: '#', icon: BarChart3 }
                ];
            case 'committee':
                return [
                    { label: 'Live Scoring', href: route('scoresheet.index'), icon: BarChart3 },
                    { label: 'Game Stats', href: '#', icon: Trophy }
                ];
            default:
                return [];
        }
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                        auth.user.role === 'admin' ? 'bg-rexa00' :
                        auth.user.role === 'coach' ? 'bg-blue-100' :
                        auth.user.role === 'referee' ? 'bg-yellow-100' :
                        auth.user.role === 'committee' ? 'bg-purple-100' :
                        'bg-orange-100'
                    }`}>
                        {getRoleIcon(auth.user.role)}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Queens Ballers Republiq - Dashboard
                        </h2>
                        <p className="text-sm text-gray-600">
                            Logged in as {auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)} - {auth.user.name}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {flash.success}
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {flash.error}
                        </div>
                    )}

                    {/* Welcome Card */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-orange-100 rounded-full">
                                    <Trophy className="h-8 w-8 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Welcome to Queens Ballers Republiq!</h3>
                                    <p className="text-gray-600">Queens Ballers Republiq Management System</p>
                                </div>
                            </div>
                            
                            {/* Role-based Welcome Message */}
                            {redirectMessage && (
                                <div className={`border rounded-lg p-4 mb-6 ${
                                    auth.user.role === 'admin' ? 'bg-red-50 border-red-200' :
                                    auth.user.role === 'coach' ? 'bg-blue-50 border-blue-200' :
                                    auth.user.role === 'referee' ? 'bg-yellow-50 border-yellow-200' :
                                    auth.user.role === 'committee' ? 'bg-purple-50 border-purple-200' :
                                    'bg-orange-50 border-orange-200'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        {getRoleIcon(auth.user.role)}
                                        <div>
                                            <p className={`font-medium ${
                                                auth.user.role === 'admin' ? 'text-red-800' :
                                                auth.user.role === 'coach' ? 'text-blue-800' :
                                                auth.user.role === 'referee' ? 'text-yellow-800' :
                                                auth.user.role === 'committee' ? 'text-purple-800' :
                                                'text-orange-800'
                                            }`}>{redirectMessage}</p>
                                            {availableFeatures && (
                                                <p className={`text-sm mt-1 ${
                                                    auth.user.role === 'admin' ? 'text-red-600' :
                                                    auth.user.role === 'coach' ? 'text-blue-600' :
                                                    auth.user.role === 'referee' ? 'text-yellow-600' :
                                                    auth.user.role === 'committee' ? 'text-purple-600' :
                                                    'text-orange-600'
                                                }`}>
                                                    Available features: {availableFeatures.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Your Profile</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <strong>Name:</strong> {auth.user.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <strong>Email:</strong> {auth.user.email}
                                        </div>
                                        {auth.user.phone && (
                                            <div className="flex items-center gap-2">
                                                <strong>Phone:</strong> {auth.user.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <strong>Role:</strong> 
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(auth.user.role)}`}>
                                                {getRoleIcon(auth.user.role)}
                                                {auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={`p-4 rounded-lg border ${
                                    auth.user.role === 'admin' ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200' :
                                    auth.user.role === 'coach' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' :
                                    auth.user.role === 'referee' ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200' :
                                    auth.user.role === 'committee' ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200' :
                                    'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                                }`}>
                                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                                    <div className="space-y-2">
                                        {getQuickActions(auth.user.role).map((action, index) => {
                                            const Icon = action.icon;
                                            const colorClass = auth.user.role === 'admin' ? 'text-red-600 group-hover:text-red-700' :
                                                             auth.user.role === 'coach' ? 'text-blue-600 group-hover:text-blue-700' :
                                                             auth.user.role === 'referee' ? 'text-yellow-600 group-hover:text-yellow-700' :
                                                             auth.user.role === 'committee' ? 'text-purple-600 group-hover:text-purple-700' :
                                                             'text-orange-600 group-hover:text-orange-700';
                                            return (
                                                <Link
                                                    key={index}
                                                    href={action.href}
                                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 transition-colors group"
                                                >
                                                    <Icon className={`h-4 w-4 ${colorClass}`} />
                                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                                        {action.label}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Quick Stats Section */}
                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-gray-900 mb-3">League Stats</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">5</div>
                                        <div className="text-gray-600">Active Games</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">12</div>
                                        <div className="text-gray-600">Teams</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">48</div>
                                        <div className="text-gray-600">Players</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">6</div>
                                        <div className="text-gray-600">Referees</div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Admin-specific sections */}
                            {auth.user.role === 'admin' && (
                                <div className="mt-6 space-y-6">
                                    {/* Admin Control Panel */}
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Shield className="h-6 w-6 text-red-600" />
                                            <h3 className="text-lg font-semibold text-gray-900">Admin Control Panel</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <Link href={route('teams.index')} className="bg-white p-4 rounded-lg border border-red-200 hover:shadow-md transition-shadow group">
                                                <div className="flex items-center gap-3">
                                                    <Users className="h-8 w-8 text-red-600 group-hover:text-red-700" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Team Management</h4>
                                                        <p className="text-sm text-gray-600">Manage all teams and players</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="bg-white p-4 rounded-lg border border-red-200 hover:shadow-md transition-shadow group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <Settings className="h-8 w-8 text-red-600 group-hover:text-red-700" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">System Settings</h4>
                                                        <p className="text-sm text-gray-600">Configure league settings</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-red-200 hover:shadow-md transition-shadow group cursor-pointer">
                                                <div className="flex items-center gap-3">
                                                    <BarChart3 className="h-8 w-8 text-red-600 group-hover:text-red-700" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Analytics</h4>
                                                        <p className="text-sm text-gray-600">View system analytics</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Recent Activity */}
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">New team "Manila Warriors" created</p>
                                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Player joined team "Cebu Dragons"</p>
                                                    <p className="text-xs text-gray-500">4 hours ago</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900">New coach registered</p>
                                                    <p className="text-xs text-gray-500">1 day ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Role-specific quick access for non-admin users */}
                            {auth.user.role !== 'admin' && (
                                <div className="mt-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            {auth.user.role === 'coach' && 'Coach Dashboard'}
                                            {auth.user.role === 'player' && 'Player Dashboard'}
                                            {auth.user.role === 'referee' && 'Referee Dashboard'}
                                            {auth.user.role === 'committee' && 'Committee Dashboard'}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {auth.user.role === 'coach' && (
                                                <>
                                                    <Link href={route('teams.index')} className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <Users className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">My Teams</h4>
                                                                <p className="text-sm text-gray-600">Manage your teams and players</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <BarChart3 className="h-6 w-6 text-blue-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">Game Stats</h4>
                                                                <p className="text-sm text-gray-600">Enter and view game statistics</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {auth.user.role === 'player' && (
                                                <>
                                                    <Link href={route('teams.index')} className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <Users className="h-6 w-6 text-orange-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">My Teams</h4>
                                                                <p className="text-sm text-gray-600">View your team memberships</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <BarChart3 className="h-6 w-6 text-orange-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">My Stats</h4>
                                                                <p className="text-sm text-gray-600">View your performance</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {auth.user.role === 'referee' && (
                                                <>
                                                    <div className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <BarChart3 className="h-6 w-6 text-yellow-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">Enter Stats</h4>
                                                                <p className="text-sm text-gray-600">Record game statistics</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <Calendar className="h-6 w-6 text-yellow-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">Match Schedule</h4>
                                                                <p className="text-sm text-gray-600">View assigned matches</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {auth.user.role === 'committee' && (
                                                <>
                                                    <Link href={route('scoresheet.index')} className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer group">
                                                        <div className="flex items-center gap-3">
                                                            <BarChart3 className="h-6 w-6 text-purple-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">Live Scoring</h4>
                                                                <p className="text-sm text-gray-600">Enter live game statistics</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                    <div className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <Trophy className="h-6 w-6 text-purple-600" />
                                                            <div>
                                                                <h4 className="font-medium text-gray-900">Game Stats</h4>
                                                                <p className="text-sm text-gray-600">View game statistics</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
