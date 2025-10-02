import { useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { Trophy, Shield, Target, Users, Zap } from 'lucide-react'

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <>
            <Head title="Login" />
            
            <div className="min-h-screen basketball-court-bg flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto basketball-card-shadow border-2 border-orange-200 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                <Trophy className="h-7 w-7 text-white basketball-bounce" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-white text-xl font-semibold">Welcome Back</h1>
                                <p className="text-orange-100 text-sm">Philippine Basketball League</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                        
                        {/* Demo Credentials */}
                        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border border-orange-200">
                            <h4 className="text-sm font-semibold text-orange-900 mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Demo Login Credentials:
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <Shield className="h-3 w-3" />
                                        <span><strong>Admin:</strong> admin@pbl.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-700">
                                        <Target className="h-3 w-3" />
                                        <span><strong>Coach:</strong> coach@pbl.com</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-orange-700">
                                        <Users className="h-3 w-3" />
                                        <span><strong>Player:</strong> player@pbl.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-700">
                                        <Zap className="h-3 w-3" />
                                        <span><strong>Referee:</strong> referee@pbl.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-orange-200">
                                <span className="text-xs font-medium text-orange-800">Password: demo123</span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    autoComplete="username"
                                    placeholder="Enter your email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-sm text-red-600">{errors.email}</div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-sm text-red-600">{errors.password}</div>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                            >
                                {processing ? 'Signing In...' : 'Sign In'}
                            </button>

                            {/* Links */}
                            <div className="text-center space-y-2">
                                <Link
                                    href={route('register')}
                                    className="text-sm text-orange-600 hover:text-orange-800"
                                >
                                    Don't have an account? Sign up
                                </Link>
                                {canResetPassword && (
                                    <div>
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Styles */}
                <style jsx>{`
                    .basketball-court-bg {
                        background: linear-gradient(135deg, #f97316 0%, #ea580c 25%, #dc2626 50%, #b91c1c 75%, #991b1b 100%);
                        background-size: 400% 400%;
                        animation: gradientShift 15s ease infinite;
                    }
                    
                    .basketball-card-shadow {
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
                    }
                    
                    .basketball-bounce {
                        animation: bounce 2s infinite;
                    }
                    
                    @keyframes gradientShift {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    
                    @keyframes bounce {
                        0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                        40%, 43% { transform: translateY(-10px); }
                    }
                `}</style>
            </div>
        </>
    )
}
