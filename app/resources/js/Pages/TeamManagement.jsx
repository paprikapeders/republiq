import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Users, Copy, Check, X, Trophy, AlertCircle, UserPlus, Settings, Edit } from 'lucide-react';

export default function TeamManagement({ auth, teams, teamMembers, userRole, flash, leagues = [], allUsers = [] }) {
    const [copied, setCopied] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [addPlayerDialogOpen, setAddPlayerDialogOpen] = useState(false);
    const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState(null);
    const [removePlayerDialogOpen, setRemovePlayerDialogOpen] = useState(false);
    const [selectedPlayerToRemove, setSelectedPlayerToRemove] = useState(null);
    const [editPlayerDialogOpen, setEditPlayerDialogOpen] = useState(false);
    const [selectedPlayerToEdit, setSelectedPlayerToEdit] = useState(null);
    const [createNewPlayer, setCreateNewPlayer] = useState(false);

    const createTeamForm = useForm({
        name: '',
        league_id: '',
        coach_id: '', // For admin to assign coach
    });

    const joinTeamForm = useForm({
        code: '',
    });

    const addPlayerForm = useForm({
        user_id: '',
        team_id: '',
        jersey_number: '',
        position: '',
        // New player fields
        name: '',
        email: '',
        phone: '',
        create_new: false,
    });

    const editPlayerForm = useForm({
        name: '',
        email: '',
        phone: '',
        jersey_number: '',
        position: '',
    });

    const handleCreateTeam = (e) => {
        e.preventDefault();
        createTeamForm.post(route('teams.create'), {
            onSuccess: () => {
                createTeamForm.reset();
                setCreateDialogOpen(false);
            },
        });
    };

    const handleJoinTeam = (e) => {
        e.preventDefault();
        joinTeamForm.post(route('teams.join'), {
            onSuccess: () => {
                joinTeamForm.reset();
                setJoinDialogOpen(false);
            },
        });
    };

    const handleAddPlayer = (e) => {
        e.preventDefault();
        addPlayerForm.post(route('admin.teams.add-player'), {
            onSuccess: () => {
                addPlayerForm.reset();
                setAddPlayerDialogOpen(false);
                setSelectedTeamForPlayer(null);
                setCreateNewPlayer(false);
            },
        });
    };

    const handleRemovePlayer = () => {
        if (!selectedPlayerToRemove) return;
        
        router.delete(route('admin.teams.remove-player', selectedPlayerToRemove.id), {
            onSuccess: () => {
                setRemovePlayerDialogOpen(false);
                setSelectedPlayerToRemove(null);
            },
        });
    };

    const handlePlayerAction = (playerId, action) => {
        router.post(route('teams.handle-player-request', playerId), {
            action: action,
        });
    };

    const copyTeamCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const openAddPlayerDialog = (team) => {
        setSelectedTeamForPlayer(team);
        addPlayerForm.setData('team_id', team.id);
        setCreateNewPlayer(false);
        setAddPlayerDialogOpen(true);
    };

    const openRemovePlayerDialog = (player) => {
        setSelectedPlayerToRemove(player);
        setRemovePlayerDialogOpen(true);
    };

    const handleEditPlayer = (e) => {
        e.preventDefault();
        editPlayerForm.put(route('admin.teams.update-player', selectedPlayerToEdit.id), {
            onSuccess: () => {
                editPlayerForm.reset();
                setEditPlayerDialogOpen(false);
                setSelectedPlayerToEdit(null);
            },
        });
    };

    const openEditPlayerDialog = (player) => {
        setSelectedPlayerToEdit(player);
        editPlayerForm.setData({
            name: player.user.name,
            email: player.user.email,
            phone: player.user.phone || '',
            jersey_number: player.jersey_number || '',
            position: player.position || '',
        });
        setEditPlayerDialogOpen(true);
    };

    // Filter users to show only players not already in the selected team
    const availableUsers = allUsers.filter(user => {
        if (user.role !== 'player') return false;
        if (!selectedTeamForPlayer) return true;
        
        const teamPlayerIds = selectedTeamForPlayer.players?.map(p => p.user_id) || [];
        return !teamPlayerIds.includes(user.id);
    });

    // Filter coaches for team assignment
    const availableCoaches = allUsers.filter(user => user.role === 'coach');

    const pendingMembers = teamMembers.filter(member => member.status === 'pending');
    const approvedMembers = teamMembers.filter(member => member.status === 'approved');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                        <Trophy className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Team Management
                        </h2>
                        <p className="text-sm text-gray-600">
                            {userRole === 'admin' 
                                ? 'Manage all teams, create teams, and add/remove players'
                                : userRole === 'coach' 
                                ? 'Manage your teams and approve members' 
                                : 'Join teams and view your membership'
                            }
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Team Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <Check className="h-5 w-5" />
                            {flash.success}
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {flash.error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        {(userRole === 'admin' || userRole === 'coach') && (
                            <button
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Create Team
                            </button>
                        )}
                        
                        {userRole === 'player' && (
                            <button
                                onClick={() => setJoinDialogOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Users className="h-4 w-4" />
                                Join Team
                            </button>
                        )}
                    </div>

                    {/* Teams Grid */}
                    {teams.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    {userRole === 'admin' 
                                        ? 'All Teams' 
                                        : userRole === 'coach' 
                                        ? 'Your Teams' 
                                        : 'Your Team Memberships'
                                    }
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {teams.map((team) => {
                                        const teamApprovedMembers = (userRole === 'coach' || userRole === 'admin')
                                            ? team.players?.filter(p => p.status === 'approved') || []
                                            : [];
                                        const teamPendingMembers = (userRole === 'coach' || userRole === 'admin')
                                            ? team.players?.filter(p => p.status === 'pending') || []
                                            : [];
                                            
                                        return (
                                            <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                                                            {team.code}
                                                        </span>
                                                        {userRole === 'admin' && (
                                                            <button
                                                                onClick={() => openAddPlayerDialog(team)}
                                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                title="Add Player"
                                                            >
                                                                <UserPlus className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {(userRole === 'coach' || userRole === 'admin') && (
                                                    <>
                                                        <button
                                                            onClick={() => copyTeamCode(team.code)}
                                                            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 rounded text-sm flex items-center justify-center gap-2 transition-colors mb-3"
                                                        >
                                                            {copied ? (
                                                                <>
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                    Copied!
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="h-4 w-4" />
                                                                    Copy Code
                                                                </>
                                                            )}
                                                        </button>
                                                        
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <p>Members: {teamApprovedMembers.length}</p>
                                                            <p>Pending: {teamPendingMembers.length}</p>
                                                            {team.leagues && team.leagues.length > 0 && (
                                                                <p>Leagues: {team.leagues.map(league => league.name).join(', ')}</p>
                                                            )}
                                                            {team.coach && userRole === 'admin' && (
                                                                <p>Coach: {team.coach.name}</p>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {userRole === 'player' && team.coach && (
                                                    <div className="text-sm text-gray-600">
                                                        <p>Coach: {team.coach.name}</p>
                                                        {team.leagues && team.leagues.length > 0 && (
                                                            <p>Leagues: {team.leagues.map(league => league.name).join(', ')}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pending Approvals (Coaches Only) */}
                    {userRole === 'coach' && pendingMembers.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Pending Approvals
                                </h3>
                                <div className="space-y-3">
                                    {pendingMembers.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{member.user.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Wants to join: {member.team.name}
                                                </p>
                                                <p className="text-xs text-gray-500">{member.user.email}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePlayerAction(member.id, 'approve')}
                                                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handlePlayerAction(member.id, 'reject')}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Team Members (Coaches and Admins) */}
                    {(userRole === 'coach' || userRole === 'admin') && approvedMembers.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Team Members
                                </h3>
                                <div className="space-y-6">
                                    {teams.map((team) => {
                                        const teamApprovedMembers = team.players?.filter(p => p.status === 'approved') || [];
                                        
                                        if (teamApprovedMembers.length === 0) return null;
                                        
                                        return (
                                            <div key={team.id}>
                                                <h4 className="font-medium text-gray-900 mb-3">{team.name}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {teamApprovedMembers.map((player) => (
                                                        <div key={player.id} className="border border-gray-200 rounded-lg p-3 relative">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900">{player.user.name}</p>
                                                                    <p className="text-sm text-gray-600">{player.user.email}</p>
                                                                    {player.user.phone && (
                                                                        <p className="text-sm text-gray-600">{player.user.phone}</p>
                                                                    )}
                                                                    {player.jersey_number && (
                                                                        <p className="text-sm text-gray-600">Jersey: #{player.jersey_number}</p>
                                                                    )}
                                                                    {player.position && (
                                                                        <p className="text-sm text-gray-600">Position: {player.position}</p>
                                                                    )}
                                                                    <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                                        {player.user.role}
                                                                    </span>
                                                                </div>
                                                                {userRole === 'admin' && (
                                                                    <div className="flex gap-1">
                                                                        <button
                                                                            onClick={() => openEditPlayerDialog(player)}
                                                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                            title="Edit Player"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => openRemovePlayerDialog(player)}
                                                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                            title="Remove Player"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {teams.length === 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-12 text-center">
                                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {(userRole === 'admin' || userRole === 'coach') ? 'No teams created yet' : 'Not a member of any team yet'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {(userRole === 'admin' || userRole === 'coach')
                                        ? 'Create your first team to start managing players and games.'
                                        : 'Join a team using the team code provided by your coach.'
                                    }
                                </p>
                                {(userRole === 'admin' || userRole === 'coach') ? (
                                    <button
                                        onClick={() => setCreateDialogOpen(true)}
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create Your First Team
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setJoinDialogOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                                    >
                                        <Users className="h-4 w-4" />
                                        Join a Team
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Team Modal */}
            {createDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Team</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Create a new team and get a code for players to join.
                        </p>
                        
                        <form onSubmit={handleCreateTeam}>
                            <div className="mb-4">
                                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Name
                                </label>
                                <input
                                    id="teamName"
                                    type="text"
                                    placeholder="Enter team name"
                                    value={createTeamForm.data.name}
                                    onChange={e => createTeamForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    required
                                />
                                {createTeamForm.errors.name && (
                                    <p className="text-red-600 text-xs mt-1">{createTeamForm.errors.name}</p>
                                )}
                            </div>

                            {userRole === 'admin' && leagues.length > 0 && (
                                <div className="mb-4">
                                    <label htmlFor="league" className="block text-sm font-medium text-gray-700 mb-2">
                                        League (Optional)
                                    </label>
                                    <select
                                        id="league"
                                        value={createTeamForm.data.league_id}
                                        onChange={e => createTeamForm.setData('league_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Select a league</option>
                                        {leagues.map((league) => (
                                            <option key={league.id} value={league.id}>
                                                {league.name}
                                            </option>
                                        ))}
                                    </select>
                                    {createTeamForm.errors.league_id && (
                                        <p className="text-red-600 text-xs mt-1">{createTeamForm.errors.league_id}</p>
                                    )}
                                </div>
                            )}

                            {userRole === 'admin' && availableCoaches.length > 0 && (
                                <div className="mb-4">
                                    <label htmlFor="coach" className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign Coach (Optional)
                                    </label>
                                    <select
                                        id="coach"
                                        value={createTeamForm.data.coach_id}
                                        onChange={e => createTeamForm.setData('coach_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    >
                                        <option value="">Select a coach</option>
                                        {availableCoaches.map((coach) => (
                                            <option key={coach.id} value={coach.id}>
                                                {coach.name} ({coach.email})
                                            </option>
                                        ))}
                                    </select>
                                    {createTeamForm.errors.coach_id && (
                                        <p className="text-red-600 text-xs mt-1">{createTeamForm.errors.coach_id}</p>
                                    )}
                                </div>
                            )}
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCreateDialogOpen(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createTeamForm.processing}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {createTeamForm.processing ? 'Creating...' : 'Create Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Join Team Modal */}
            {joinDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Join Team</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Enter the team code provided by your coach.
                        </p>
                        
                        <form onSubmit={handleJoinTeam}>
                            <div className="mb-4">
                                <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">
                                    Team Code
                                </label>
                                <input
                                    id="joinCode"
                                    type="text"
                                    placeholder="Enter team code"
                                    value={joinTeamForm.data.code}
                                    onChange={e => joinTeamForm.setData('code', e.target.value.toUpperCase())}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                                    maxLength={6}
                                    required
                                />
                                {joinTeamForm.errors.code && (
                                    <p className="text-red-600 text-xs mt-1">{joinTeamForm.errors.code}</p>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setJoinDialogOpen(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={joinTeamForm.processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {joinTeamForm.processing ? 'Joining...' : 'Join Team'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Player Modal (Admin Only) */}
            {addPlayerDialogOpen && userRole === 'admin' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Player to Team</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Add a player to {selectedTeamForPlayer?.name}
                        </p>
                        
                        {/* Toggle between existing and new player */}
                        <div className="mb-4">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreateNewPlayer(false);
                                        addPlayerForm.setData({
                                            ...addPlayerForm.data,
                                            user_id: '',
                                            name: '',
                                            email: '',
                                            phone: '',
                                        });
                                    }}
                                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                        !createNewPlayer 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Existing Player
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCreateNewPlayer(true);
                                        addPlayerForm.setData({
                                            ...addPlayerForm.data,
                                            user_id: '',
                                        });
                                    }}
                                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                                        createNewPlayer 
                                            ? 'bg-white text-blue-600 shadow-sm' 
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Create New Player
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={handleAddPlayer}>
                            {!createNewPlayer ? (
                                // Existing Player Selection
                                <div className="mb-4">
                                    <label htmlFor="player" className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Player
                                    </label>
                                    <select
                                        id="player"
                                        value={addPlayerForm.data.user_id}
                                        onChange={e => addPlayerForm.setData('user_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required={!createNewPlayer}
                                    >
                                        <option value="">Select a player</option>
                                        {availableUsers.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {addPlayerForm.errors.user_id && (
                                        <p className="text-red-600 text-xs mt-1">{addPlayerForm.errors.user_id}</p>
                                    )}
                                </div>
                            ) : (
                                // New Player Creation Fields
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
                                            Player Name *
                                        </label>
                                        <input
                                            id="playerName"
                                            type="text"
                                            placeholder="Enter player's full name"
                                            value={addPlayerForm.data.name}
                                            onChange={e => addPlayerForm.setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={createNewPlayer}
                                        />
                                        {addPlayerForm.errors.name && (
                                            <p className="text-red-600 text-xs mt-1">{addPlayerForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="playerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            id="playerEmail"
                                            type="email"
                                            placeholder="Enter player's email"
                                            value={addPlayerForm.data.email}
                                            onChange={e => addPlayerForm.setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required={createNewPlayer}
                                        />
                                        {addPlayerForm.errors.email && (
                                            <p className="text-red-600 text-xs mt-1">{addPlayerForm.errors.email}</p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="playerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number (Optional)
                                        </label>
                                        <input
                                            id="playerPhone"
                                            type="tel"
                                            placeholder="Enter player's phone number"
                                            value={addPlayerForm.data.phone}
                                            onChange={e => addPlayerForm.setData('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {addPlayerForm.errors.phone && (
                                            <p className="text-red-600 text-xs mt-1">{addPlayerForm.errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Note:</strong> A new player account will be created with the default password: <code className="bg-yellow-100 px-1 rounded">defaultpassword123</code>
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="mb-4">
                                <label htmlFor="jerseyNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Jersey Number (Optional)
                                </label>
                                <input
                                    id="jerseyNumber"
                                    type="number"
                                    placeholder="Enter jersey number"
                                    value={addPlayerForm.data.jersey_number}
                                    onChange={e => addPlayerForm.setData('jersey_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="99"
                                />
                                {addPlayerForm.errors.jersey_number && (
                                    <p className="text-red-600 text-xs mt-1">{addPlayerForm.errors.jersey_number}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                    Position (Optional)
                                </label>
                                <select
                                    id="position"
                                    value={addPlayerForm.data.position}
                                    onChange={e => addPlayerForm.setData('position', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select position</option>
                                    <option value="Point Guard">Point Guard</option>
                                    <option value="Shooting Guard">Shooting Guard</option>
                                    <option value="Small Forward">Small Forward</option>
                                    <option value="Power Forward">Power Forward</option>
                                    <option value="Center">Center</option>
                                </select>
                                {addPlayerForm.errors.position && (
                                    <p className="text-red-600 text-xs mt-1">{addPlayerForm.errors.position}</p>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAddPlayerDialogOpen(false);
                                        setSelectedTeamForPlayer(null);
                                        setCreateNewPlayer(false);
                                        addPlayerForm.reset();
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addPlayerForm.processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {addPlayerForm.processing ? 'Adding...' : (createNewPlayer ? 'Create & Add Player' : 'Add Player')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Remove Player Modal (Admin Only) */}
            {removePlayerDialogOpen && userRole === 'admin' && selectedPlayerToRemove && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Remove Player</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Are you sure you want to remove <strong>{selectedPlayerToRemove.user?.name}</strong> from the team?
                        </p>
                        <p className="text-xs text-gray-500 mb-6">
                            This action cannot be undone. The player will need to rejoin the team if needed.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setRemovePlayerDialogOpen(false);
                                    setSelectedPlayerToRemove(null);
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleRemovePlayer}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                Remove Player
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Player Modal (Admin Only) */}
            {editPlayerDialogOpen && userRole === 'admin' && selectedPlayerToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Player Details</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Update information for <strong>{selectedPlayerToEdit.user?.name}</strong>
                        </p>
                        
                        <form onSubmit={handleEditPlayer}>
                            <div className="mb-4">
                                <label htmlFor="editPlayerName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Player Name *
                                </label>
                                <input
                                    id="editPlayerName"
                                    type="text"
                                    placeholder="Enter player's full name"
                                    value={editPlayerForm.data.name}
                                    onChange={e => editPlayerForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {editPlayerForm.errors.name && (
                                    <p className="text-red-600 text-xs mt-1">{editPlayerForm.errors.name}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="editPlayerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    id="editPlayerEmail"
                                    type="email"
                                    placeholder="Enter player's email"
                                    value={editPlayerForm.data.email}
                                    onChange={e => editPlayerForm.setData('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {editPlayerForm.errors.email && (
                                    <p className="text-red-600 text-xs mt-1">{editPlayerForm.errors.email}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="editPlayerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    id="editPlayerPhone"
                                    type="tel"
                                    placeholder="Enter player's phone number"
                                    value={editPlayerForm.data.phone}
                                    onChange={e => editPlayerForm.setData('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {editPlayerForm.errors.phone && (
                                    <p className="text-red-600 text-xs mt-1">{editPlayerForm.errors.phone}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="editJerseyNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                    Jersey Number (Optional)
                                </label>
                                <input
                                    id="editJerseyNumber"
                                    type="number"
                                    placeholder="Enter jersey number"
                                    value={editPlayerForm.data.jersey_number}
                                    onChange={e => editPlayerForm.setData('jersey_number', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    min="0"
                                    max="99"
                                />
                                {editPlayerForm.errors.jersey_number && (
                                    <p className="text-red-600 text-xs mt-1">{editPlayerForm.errors.jersey_number}</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="editPosition" className="block text-sm font-medium text-gray-700 mb-2">
                                    Position (Optional)
                                </label>
                                <select
                                    id="editPosition"
                                    value={editPlayerForm.data.position}
                                    onChange={e => editPlayerForm.setData('position', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select position</option>
                                    <option value="Point Guard">Point Guard</option>
                                    <option value="Shooting Guard">Shooting Guard</option>
                                    <option value="Small Forward">Small Forward</option>
                                    <option value="Power Forward">Power Forward</option>
                                    <option value="Center">Center</option>
                                </select>
                                {editPlayerForm.errors.position && (
                                    <p className="text-red-600 text-xs mt-1">{editPlayerForm.errors.position}</p>
                                )}
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditPlayerDialogOpen(false);
                                        setSelectedPlayerToEdit(null);
                                        editPlayerForm.reset();
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editPlayerForm.processing}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {editPlayerForm.processing ? 'Updating...' : 'Update Player'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}