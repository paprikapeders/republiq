import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Trophy, Menu, X } from 'lucide-react';

export function PublicNavbar({ currentPage, onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#1a1a2e] border-b border-[#16213e]/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo and Title */}
                    <div 
                        className="flex items-center space-x-2 lg:space-x-3 cursor-pointer" 
                        onClick={() => onNavigate('schedules')}
                    >
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Trophy className="h-5 w-5 lg:h-7 lg:w-7 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg lg:text-xl font-bold text-white">Queens Ballers Republiq</h1>
                            <p className="text-xs text-gray-400">Queens Basketball League</p>
                        </div>
                        <div className="sm:hidden">
                            <h1 className="text-lg font-bold text-white">QBR</h1>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <button
                            onClick={() => onNavigate('schedules')}
                            className={`text-sm lg:text-base transition-colors ${
                                currentPage === 'schedules'
                                    ? 'text-orange-500'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Schedules
                        </button>
                        <button
                            onClick={() => onNavigate('teams')}
                            className={`text-sm lg:text-base transition-colors ${
                                currentPage === 'teams'
                                    ? 'text-orange-500'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Teams
                        </button>
                        <button
                            onClick={() => onNavigate('leaderboards')}
                            className={`text-sm lg:text-base transition-colors ${
                                currentPage === 'leaderboards'
                                    ? 'text-orange-500'
                                    : 'text-gray-300 hover:text-white'
                            }`}
                        >
                            Leaderboards
                        </button>
                        <Link
                            href={route('login')}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-colors text-sm lg:text-base"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[#16213e]/30">
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    onNavigate('schedules');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                                    currentPage === 'schedules'
                                        ? 'text-orange-500 bg-orange-500/10'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Schedules
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate('teams');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                                    currentPage === 'teams'
                                        ? 'text-orange-500 bg-orange-500/10'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Teams
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate('leaderboards');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors ${
                                    currentPage === 'leaderboards'
                                        ? 'text-orange-500 bg-orange-500/10'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                Leaderboards
                            </button>
                            <Link
                                href={route('login')}
                                className="mx-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}