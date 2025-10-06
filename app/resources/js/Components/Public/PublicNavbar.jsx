import React from 'react';
import { Link } from '@inertiajs/react';
import { Trophy } from 'lucide-react';

export function PublicNavbar({ currentPage, onNavigate }) {
    return (
        <nav className="bg-[#1a1a2e] border-b border-[#16213e]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo and Title */}
                    <div 
                        className="flex items-center space-x-3 cursor-pointer" 
                        onClick={() => onNavigate('schedules')}
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Trophy className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Philippine Basketball League</h1>
                            <p className="text-xs text-gray-400">2024 Season</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-8">
                        <button
                            onClick={() => onNavigate('schedules')}
                            className={`transition-colors ${
                                currentPage === 'schedules'
                                    ? 'text-orange-500'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Schedules
                        </button>
                        <button
                            onClick={() => onNavigate('teams')}
                            className={`transition-colors ${
                                currentPage === 'teams'
                                    ? 'text-orange-500'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Teams
                        </button>
                        <Link
                            href={route('login')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}