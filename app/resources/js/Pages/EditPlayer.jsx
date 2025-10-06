import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, ArrowLeft, Save, X } from 'lucide-react';

export default function EditPlayer({ auth, player }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: player.user.name || '',
        email: player.user.email || '',
        phone: player.user.phone || '',
        jersey_number: player.jersey_number || '',
        position: player.position || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.teams.update-player', player.id), {
            onSuccess: () => {
                // Redirect back to team management with success message
            },
        });
    };

    const positions = [
        { value: '', label: 'Select position' },
        { value: 'Point Guard', label: 'Point Guard' },
        { value: 'Shooting Guard', label: 'Shooting Guard' },
        { value: 'Small Forward', label: 'Small Forward' },
        { value: 'Power Forward', label: 'Power Forward' },
        { value: 'Center', label: 'Center' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit Player
                        </h2>
                        <p className="text-sm text-gray-600">
                            Update player information for {player.user.name}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Edit Player - ${player.user.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Navigation */}
                            <div className="flex items-center gap-4 mb-6">
                                <Link
                                    href={route('teams.index')}
                                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Team Management
                                </Link>
                            </div>

                            {/* Player Info Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <User className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{player.user.name}</h3>
                                        <p className="text-gray-600">Team: {player.team.name}</p>
                                        <p className="text-sm text-gray-500">Team Code: {player.team.code}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter phone number (optional)"
                                            />
                                            {errors.phone && (
                                                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Basketball Information */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basketball Information</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="jersey_number" className="block text-sm font-medium text-gray-700 mb-2">
                                                Jersey Number
                                            </label>
                                            <input
                                                id="jersey_number"
                                                type="number"
                                                value={data.jersey_number}
                                                onChange={e => setData('jersey_number', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min="0"
                                                max="99"
                                                placeholder="Enter jersey number (optional)"
                                            />
                                            {errors.jersey_number && (
                                                <p className="text-red-600 text-sm mt-1">{errors.jersey_number}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                                Position
                                            </label>
                                            <select
                                                id="position"
                                                value={data.position}
                                                onChange={e => setData('position', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {positions.map((position) => (
                                                    <option key={position.value} value={position.value}>
                                                        {position.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.position && (
                                                <p className="text-red-600 text-sm mt-1">{errors.position}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6">
                                    <Link
                                        href={route('teams.index')}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Player'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}