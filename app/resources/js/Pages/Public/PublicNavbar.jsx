import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Trophy, Menu, X } from 'lucide-react';

export function PublicNavbar({ currentPage, onNavigate }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white/90 border-b border-orange-200/50 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo and Title */}
                    <div 
                        className="flex items-center space-x-2 lg:space-x-3 cursor-pointer" 
                        onClick={() => onNavigate('home')}
                    >
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Trophy className="h-5 w-5 lg:h-7 lg:w-7 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">Queens Ballers Republiq</h1>
                            <p className="text-xs text-slate-600">Queens Basketball League</p>
                        </div>
                        <div className="sm:hidden">
                            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">QBR</h1>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <button
                            onClick={() => onNavigate('home')}
                            className={`text-sm lg:text-base font-medium transition-colors ${
                                currentPage === 'home'
                                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                                    : 'text-slate-700 hover:text-orange-600'
                            }`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => onNavigate('schedules')}
                            className={`text-sm lg:text-base font-medium transition-colors ${
                                currentPage === 'schedules'
                                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                                    : 'text-slate-700 hover:text-orange-600'
                            }`}
                        >
                            Schedules
                        </button>
                        <button
                            onClick={() => onNavigate('teams')}
                            className={`text-sm lg:text-base font-medium transition-colors ${
                                currentPage === 'teams'
                                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                                    : 'text-slate-700 hover:text-orange-600'
                            }`}
                        >
                            Teams
                        </button>
                        <button
                            onClick={() => onNavigate('leaderboards')}
                            className={`text-sm lg:text-base font-medium transition-colors ${
                                currentPage === 'leaderboards'
                                    ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                                    : 'text-slate-700 hover:text-orange-600'
                            }`}
                        >
                            Leaderboards
                        </button>
                        <Link
                            href={route('login')}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-all text-sm lg:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-600 hover:text-orange-600 p-2 transition-colors"
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
                    <div className="md:hidden py-4 border-t border-orange-200/50 bg-white/95 backdrop-blur-sm">
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    onNavigate('home');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                                    currentPage === 'home'
                                        ? 'text-orange-600 bg-orange-100'
                                        : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                Home
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate('schedules');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                                    currentPage === 'schedules'
                                        ? 'text-orange-600 bg-orange-100'
                                        : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                Schedules
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate('teams');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                                    currentPage === 'teams'
                                        ? 'text-orange-600 bg-orange-100'
                                        : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                Teams
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate('leaderboards');
                                    setMobileMenuOpen(false);
                                }}
                                className={`text-left px-4 py-2 rounded-lg transition-colors font-medium ${
                                    currentPage === 'leaderboards'
                                        ? 'text-orange-600 bg-orange-100'
                                        : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50'
                                }`}
                            >
                                Leaderboards
                            </button>
                            <Link
                                href={route('login')}
                                className="mx-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all text-center shadow-lg"
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