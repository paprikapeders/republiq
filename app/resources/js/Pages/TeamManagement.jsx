import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Users, Copy, Check, X, Trophy, AlertCircle } from 'lucide-react';

export default function TeamManagement({ auth, teams, teamMembers, userRole, flash }) {
    const [copied, setCopied] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);

    const createTeamForm = useForm({
        name: '',
    });

    const joinTeamForm = useForm({
        code: '',
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
                            {userRole === 'coach' ? 'Manage your teams and approve members' : 'Join teams and view your membership'}
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
                        {userRole === 'coach' && (
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
                                    {userRole === 'coach' ? 'Your Teams' : 'Your Team Memberships'}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {teams.map((team) => {
                                        const teamApprovedMembers = userRole === 'coach' 
                                            ? team.players?.filter(p => p.status === 'approved') || []
                                            : [];
                                        const teamPendingMembers = userRole === 'coach'
                                            ? team.players?.filter(p => p.status === 'pending') || []
                                            : [];
                                            
                                        return (
                                            <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                                                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
                                                        {team.code}
                                                    </span>
                                                </div>
                                                
                                                {userRole === 'coach' && (
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
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {userRole === 'player' && team.coach && (
                                                    <div className="text-sm text-gray-600">
                                                        <p>Coach: {team.coach.name}</p>
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

                    {/* Team Members (Coaches Only) */}
                    {userRole === 'coach' && approvedMembers.length > 0 && (
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
                                                        <div key={player.id} className="border border-gray-200 rounded-lg p-3">
                                                            <p className="font-medium text-gray-900">{player.user.name}</p>
                                                            <p className="text-sm text-gray-600">{player.user.email}</p>
                                                            {player.user.phone && (
                                                                <p className="text-sm text-gray-600">{player.user.phone}</p>
                                                            )}
                                                            <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                                {player.user.role}
                                                            </span>
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
                                    {userRole === 'coach' ? 'No teams created yet' : 'Not a member of any team yet'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {userRole === 'coach' 
                                        ? 'Create your first team to start managing players and games.'
                                        : 'Join a team using the team code provided by your coach.'
                                    }
                                </p>
                                {userRole === 'coach' ? (
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
        </AuthenticatedLayout>
    );
}