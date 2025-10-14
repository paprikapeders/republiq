import React from 'react';
import { Link } from '@inertiajs/react';
import { Trophy, Users, Calendar, TrendingUp, Star, Circle, Target, Award, Zap, Medal } from 'lucide-react';

export default function ThemeShowcase() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-blue-50">
            {/* Header Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-orange-200/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Circle className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                                QUEENS LEAGUE
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-slate-700 hover:text-orange-600 font-medium transition-colors">
                                Back to Current Site
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-100/30 to-blue-100/30"></div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                        <Zap className="h-4 w-4" />
                        New Theme Preview
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black mb-6">
                        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                            LIGHTER
                        </span>
                        <br />
                        <span className="text-slate-800">& SPORTIER</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                        A fresh, energetic color scheme that brings your basketball league to life with vibrant oranges, 
                        dynamic blues, and clean whites.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                            <Trophy className="h-5 w-5 inline mr-2" />
                            View Leaderboards
                        </button>
                        <button className="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all border border-slate-200">
                            <Calendar className="h-5 w-5 inline mr-2" />
                            Game Schedule
                        </button>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full opacity-20 animate-bounce delay-1000"></div>
                <div className="absolute top-1/2 right-20 w-12 h-12 bg-gradient-to-br from-orange-300 to-blue-300 rounded-full opacity-30 animate-pulse"></div>
            </section>

            {/* Color Palette Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Color Palette</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Primary Orange */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-4 shadow-lg"></div>
                            <h3 className="font-semibold text-slate-800">Primary Orange</h3>
                            <p className="text-sm text-slate-600">#F97316 → #EA580C</p>
                        </div>
                        
                        {/* Primary Blue */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 shadow-lg"></div>
                            <h3 className="font-semibold text-slate-800">Primary Blue</h3>
                            <p className="text-sm text-slate-600">#3B82F6 → #2563EB</p>
                        </div>
                        
                        {/* Light Background */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl mx-auto mb-4 shadow-lg border border-slate-200"></div>
                            <h3 className="font-semibold text-slate-800">Light Background</h3>
                            <p className="text-sm text-slate-600">#F8FAFC → #F1F5F9</p>
                        </div>
                        
                        {/* Accent Colors */}
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mx-auto mb-4 shadow-lg"></div>
                            <h3 className="font-semibold text-slate-800">Success Green</h3>
                            <p className="text-sm text-slate-600">#34D399 → #14B8A6</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Component Showcase */}
            <section className="py-16 bg-gradient-to-r from-slate-50 to-orange-50/30">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Component Examples</h2>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-orange-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                    <Trophy className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Total Games</p>
                                    <p className="text-2xl font-bold text-slate-800">247</p>
                                </div>
                            </div>
                            <div className="w-full bg-orange-100 rounded-full h-2">
                                <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full w-3/4"></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Active Players</p>
                                    <p className="text-2xl font-bold text-slate-800">156</p>
                                </div>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full w-5/6"></div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-emerald-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600">Season Progress</p>
                                    <p className="text-2xl font-bold text-slate-800">78%</p>
                                </div>
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2">
                                <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full w-4/5"></div>
                            </div>
                        </div>
                    </div>

                    {/* Player Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* MVP Card */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 text-center border border-yellow-200 shadow-lg">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                                <Medal className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">John Smith</h3>
                            <p className="text-orange-600 font-semibold mb-4">MVP Leader</p>
                            <div className="bg-white rounded-xl p-4 border border-orange-200">
                                <p className="text-2xl font-bold text-orange-600">95.2</p>
                                <p className="text-sm text-slate-600">Rating</p>
                            </div>
                        </div>

                        {/* Top Scorer */}
                        <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-8 text-center border border-blue-200 shadow-lg">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                                <Target className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Mike Johnson</h3>
                            <p className="text-blue-600 font-semibold mb-4">Top Scorer</p>
                            <div className="bg-white rounded-xl p-4 border border-blue-200">
                                <p className="text-2xl font-bold text-blue-600">28.5</p>
                                <p className="text-sm text-slate-600">PPG</p>
                            </div>
                        </div>

                        {/* Rising Star */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center border border-emerald-200 shadow-lg">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                                <Star className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Alex Wilson</h3>
                            <p className="text-emerald-600 font-semibold mb-4">Rising Star</p>
                            <div className="bg-white rounded-xl p-4 border border-emerald-200">
                                <p className="text-2xl font-bold text-emerald-600">+15.2</p>
                                <p className="text-sm text-slate-600">Improvement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Button Variations */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Button Variations</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                            Primary Action
                        </button>
                        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                            Secondary Action
                        </button>
                        <button className="bg-white text-slate-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all border border-slate-200">
                            Neutral Action
                        </button>
                        <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                            Success Action
                        </button>
                    </div>
                </div>
            </section>

            {/* Game Schedule Preview */}
            <section className="py-16 bg-gradient-to-r from-orange-50/50 to-blue-50/50">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">Game Schedule Preview</h2>
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:border-orange-300 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">LAK</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Lakers vs Warriors</p>
                                        <p className="text-sm text-slate-600">Today, 7:00 PM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Live
                                    </span>
                                    <p className="text-sm text-slate-600 mt-1">Main Court</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:border-orange-300 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">PHX</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Phoenix vs Celtics</p>
                                        <p className="text-sm text-slate-600">Tomorrow, 8:30 PM</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                        Scheduled
                                    </span>
                                    <p className="text-sm text-slate-600 mt-1">Court B</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Circle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold">QUEENS LEAGUE</span>
                    </div>
                    <p className="text-slate-400 mb-6">
                        This is a preview of the new lighter, more sporty theme design.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link 
                            href="/" 
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all"
                        >
                            Return to Current Site
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}