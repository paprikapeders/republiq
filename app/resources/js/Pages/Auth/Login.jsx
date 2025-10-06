import { useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { Trophy, Shield, Target, Users, Zap, ArrowLeft } from 'lucide-react'

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
            
            <div className="min-h-screen bg-[#0f0f1e] flex items-center justify-center p-4">
                {/* Back to Home Button */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>

                <div className="w-full max-w-md mx-auto bg-[#1a1a2e] border border-[#16213e] rounded-lg overflow-hidden shadow-2xl">
                    {/* Header */}
                    <div className="text-center bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Trophy className="h-7 w-7 text-white" />
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
                            <div className="mb-4 text-sm font-medium text-green-400">
                                {status}
                            </div>
                        )}
                        
                        {/* Demo Credentials */}
                        <div className="mb-6 p-4 bg-[#0f0f1e] rounded-lg border border-[#16213e]">
                            <h4 className="text-sm font-semibold text-orange-500 mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Demo Login Credentials:
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <Shield className="h-3 w-3" />
                                        <span><strong>Admin:</strong> admin@pbl.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <Target className="h-3 w-3" />
                                        <span><strong>Coach:</strong> coach@pbl.com</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Users className="h-3 w-3" />
                                        <span><strong>Player:</strong> player@pbl.com</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-yellow-400">
                                        <Zap className="h-3 w-3" />
                                        <span><strong>Referee:</strong> referee@pbl.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-[#16213e]">
                                <span className="text-xs font-medium text-orange-400">Password: demo123</span>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    autoComplete="username"
                                    placeholder="Enter your email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-sm text-red-400">{errors.email}</div>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-sm text-red-400">{errors.password}</div>
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
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-[#16213e] bg-[#0f0f1e] rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
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
                                    className="text-sm text-orange-400 hover:text-orange-300"
                                >
                                    Don't have an account? Sign up
                                </Link>
                                {canResetPassword && (
                                    <div>
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-gray-400 hover:text-gray-300"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
