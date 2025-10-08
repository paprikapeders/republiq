import React, { useState, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Calendar, Trophy, Users, Settings, Plus, Edit, 
    Trash2, Play, Pause, CheckCircle, XCircle,
    AlertCircle, Activity
} from 'lucide-react';

export default function SeasonManagement({ auth, seasons, availableTeams, allTeams, activeSeasonId, userRole, flash }) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSeasonId, setEditingSeasonId] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(seasons?.[0]?.id || null);
    const [showTeamModal, setShowTeamModal] = useState(false);

    // Get current season and its teams
    const currentSeason = seasons?.find(s => s.id == selectedSeason);
    const currentSeasonTeams = currentSeason?.teams || [];

    // Update selected season if seasons change and current selection is invalid
    useEffect(() => {
        if (seasons && seasons.length > 0 && !seasons.find(s => s.id == selectedSeason)) {
            setSelectedSeason(seasons[0].id);
        }
    }, [seasons, selectedSeason]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        year: new Date().getFullYear(),
        description: '',
        start_date: '',
        end_date: '',
        status: 'upcoming'
    });

    const teamForm = useForm({
        team_id: '',
    });

    // Check if user is admin
    const isAdmin = userRole === 'admin';

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingSeasonId) {
            put(route('season-management.update', editingSeasonId), {
                onSuccess: () => {
                    setEditingSeasonId(null);
                    setShowCreateForm(false);
                    reset();
                }
            });
        } else {
            post(route('season-management.store'), {
                onSuccess: () => {
                    setShowCreateForm(false);
                    reset();
                }
            });
        }
    };

    const handleEdit = (season) => {
        setData({
            name: season.name,
            description: season.description || '',
            start_date: season.start_date,
            end_date: season.end_date,
            max_teams: season.max_teams || 16,
            registration_fee: season.registration_fee || 0,
            status: season.status
        });
        setEditingSeasonId(season.id);
        setShowCreateForm(true);
    };

    const handleDelete = (seasonId) => {
        if (confirm('Are you sure you want to delete this season? This action cannot be undone.')) {
            router.delete(route('season-management.destroy', seasonId));
        }
    };

    const activateSeason = (seasonId) => {
        router.post(route('season-management.activate', seasonId));
    };

    const updateSeasonStatus = (seasonId, newStatus) => {
        router.post(route('season-management.update-status', seasonId), {
            status: newStatus
        });
    };

    const addTeamToSeason = (e) => {
        e.preventDefault();
        if (!selectedSeason || !teamForm.data.team_id) return;
        
        teamForm.post(route('season-management.add-team', selectedSeason), {
            onSuccess: () => {
                teamForm.reset();
                setShowTeamModal(false);
            }
        });
    };

    const removeTeamFromSeason = (teamId) => {
        if (!selectedSeason) return;
        if (confirm('Remove this team from the season?')) {
            router.post(route('season-management.remove-team', selectedSeason), {
                team_id: teamId
            });
        }
    };

    const cancelForm = () => {
        setShowCreateForm(false);
        setEditingSeasonId(null);
        reset();
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Calendar },
            active: { bg: 'bg-green-100', text: 'text-green-800', icon: Play },
            completed: { bg: 'bg-gray-100', text: 'text-gray-800', icon: CheckCircle },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
        };

        const config = statusConfig[status] || statusConfig.upcoming;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                <Icon className="h-3 w-3 mr-1" />
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!isAdmin) {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Access Denied
                            </h2>
                            <p className="text-sm text-gray-600">Admin privileges required</p>
                        </div>
                    </div>
                }
            >
                <Head title="Season Management" />
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
                                <p className="text-gray-600">You need administrator privileges to access season management.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <Settings className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Season Management
                            </h2>
                            <p className="text-sm text-gray-600">Manage Queens Ballers Republiq seasons and tournaments</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        New Season
                    </button>
                </div>
            }
        >
            <Head title="Season Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {flash.success}
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {flash.error}
                        </div>
                    )}

                    {/* Active Season Banner */}
                    {seasons.find(s => s.id === activeSeasonId) && (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <Activity className="h-6 w-6 text-green-600" />
                                <div>
                                    <h3 className="font-medium text-green-900">
                                        Active Season: {seasons.find(s => s.id === activeSeasonId)?.name}
                                    </h3>
                                    <p className="text-sm text-green-700">
                                        All new games and registrations will be assigned to this season.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Create/Edit Form */}
                    {showCreateForm && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {editingSeasonId ? 'Edit Season' : 'Create New Season'}
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Season Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                placeholder="e.g., Spring 2024 League"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Year *
                                            </label>
                                            <input
                                                type="number"
                                                value={data.year}
                                                onChange={(e) => setData('year', parseInt(e.target.value))}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                placeholder="e.g., 2024"
                                                min="2020"
                                                max="2050"
                                                required
                                            />
                                            {errors.year && (
                                                <p className="text-red-600 text-sm mt-1">{errors.year}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                            >
                                                <option value="upcoming">Upcoming</option>
                                                <option value="active">Active</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Start Date *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.start_date}
                                                onChange={(e) => setData('start_date', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                required
                                            />
                                            {errors.start_date && (
                                                <p className="text-red-600 text-sm mt-1">{errors.start_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                End Date *
                                            </label>
                                            <input
                                                type="date"
                                                value={data.end_date}
                                                onChange={(e) => setData('end_date', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                required
                                            />
                                            {errors.end_date && (
                                                <p className="text-red-600 text-sm mt-1">{errors.end_date}</p>
                                            )}
                                        </div>

                                    </div>

                                    <div className="col-span-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                            rows="3"
                                            placeholder="Optional description of the season..."
                                        />
                                        {errors.description && (
                                            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                        )}
                                    </div>



                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                        >
                                            {processing ? 'Saving...' : (editingSeasonId ? 'Update Season' : 'Create Season')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelForm}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Seasons List */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">All Seasons</h3>
                            
                            {seasons && seasons.length > 0 ? (
                                <div className="space-y-4">
                                    {seasons.map((season) => (
                                        <div key={season.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="text-lg font-medium text-gray-900">
                                                            {season.name}
                                                        </h4>
                                                        
                                                        {/* Status Dropdown for Admin */}
                                                        <div className="relative">
                                                            <select
                                                                value={season.status}
                                                                onChange={(e) => updateSeasonStatus(season.id, e.target.value)}
                                                                className="text-xs border-0 bg-transparent focus:ring-1 focus:ring-purple-500 rounded cursor-pointer font-medium"
                                                                style={{
                                                                    color: season.status === 'active' ? '#065f46' : 
                                                                           season.status === 'upcoming' ? '#1e40af' : '#374151'
                                                                }}
                                                            >
                                                                <option value="upcoming">Upcoming</option>
                                                                <option value="active">Active</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </div>
                                                        
                                                        {season.is_active && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                <Activity className="h-3 w-3 mr-1" />
                                                                Current Active
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Start:</span> {formatDate(season.start_date)}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">End:</span> {formatDate(season.end_date)}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Max Teams:</span> {season.max_teams || 16}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Fee:</span> ${season.registration_fee || 0}
                                                        </div>
                                                    </div>
                                                    
                                                    {season.description && (
                                                        <p className="text-sm text-gray-600 mt-2">{season.description}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    {season.status === 'upcoming' && season.id !== activeSeasonId && (
                                                        <button
                                                            onClick={() => activateSeason(season.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                        >
                                                            <Play className="h-3 w-3" />
                                                            Activate
                                                        </button>
                                                    )}
                                                    
                                                    <button
                                                        onClick={() => handleEdit(season)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                        Edit
                                                    </button>
                                                    
                                                    {season.status !== 'active' && (
                                                        <button
                                                            onClick={() => handleDelete(season.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No seasons created yet</p>
                                    <button
                                        onClick={() => setShowCreateForm(true)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Create Your First Season
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Team Management Section */}
                    {selectedSeason && currentSeason && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Team Management</h3>
                                        <p className="text-sm text-gray-600">
                                            Season: {currentSeason?.name || 'Select a season'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {currentSeasonTeams.length} team{currentSeasonTeams.length !== 1 ? 's' : ''} assigned
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={selectedSeason || ''}
                                            onChange={(e) => setSelectedSeason(e.target.value ? parseInt(e.target.value) : null)}
                                            className="border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                        >
                                            <option value="">Select a season...</option>
                                            {seasons?.map((season) => (
                                                <option key={season.id} value={season.id}>
                                                    {season.name} ({season.teams?.length || 0} teams)
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => setShowTeamModal(true)}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Team
                                        </button>
                                    </div>
                                </div>

                                {/* Current Teams */}
                                <div className="space-y-3">
                                    {currentSeasonTeams.length > 0 ? (
                                        currentSeasonTeams.map((team) => (
                                            <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                                                    <p className="text-sm text-gray-600">Code: {team.code}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeTeamFromSeason(team.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">No teams assigned to this season yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Team Modal */}
                    {showTeamModal && (
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div className="mt-3">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Add Team to Season</h3>
                                    
                                    <form onSubmit={addTeamToSeason}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Available Teams for {currentSeason?.name || 'Selected Season'} 
                                                <span className="text-gray-500 font-normal">
                                                    ({allTeams?.filter(team => {
                                                        return !currentSeasonTeams.some(seasonTeam => seasonTeam.id === team.id);
                                                    }).length || 0} available)
                                                </span>
                                            </label>
                                            <select
                                                value={teamForm.data.team_id}
                                                onChange={(e) => teamForm.setData('team_id', e.target.value)}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                                required
                                            >
                                                <option value="">Choose a team...</option>
                                                {allTeams?.filter(team => {
                                                    // Show teams that are not assigned to the currently selected season
                                                    return !currentSeasonTeams.some(seasonTeam => seasonTeam.id === team.id);
                                                }).map((team) => (
                                                    <option key={team.id} value={team.id}>
                                                        {team.name} ({team.code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={teamForm.processing}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                            >
                                                {teamForm.processing ? 'Adding...' : 'Add Team'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowTeamModal(false);
                                                    teamForm.reset();
                                                }}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}