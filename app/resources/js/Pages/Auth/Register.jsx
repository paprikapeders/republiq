import { Head, useForm, Link } from '@inertiajs/react'
import { Trophy, Users, Target, Zap, ArrowLeft } from 'lucide-react'

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        phone: '',
        waiver_accepted: false,
    })

    const submit = (e) => {
        e.preventDefault()
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <>
            <Head title="Register" />

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
                    <div className="text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Trophy className="h-7 w-7 text-white" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-white text-xl font-semibold">Join the League</h1>
                                <p className="text-blue-100 text-sm">Philippine Basketball League</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <div className="text-sm text-red-400">{errors.name}</div>
                                )}
                            </div>

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
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="username"
                                    placeholder="Enter your email"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <div className="text-sm text-red-400">{errors.email}</div>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-300">
                                    Phone (Optional)
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your phone number"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && (
                                    <div className="text-sm text-red-400">{errors.phone}</div>
                                )}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-gray-300">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="">Select your role</option>
                                    <option value="player">Player</option>
                                    <option value="coach">Coach</option>
                                    <option value="referee">Referee</option>
                                </select>
                                {errors.role && (
                                    <div className="text-sm text-red-400">{errors.role}</div>
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
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-sm text-red-400">{errors.password}</div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-300">
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full px-3 py-2 bg-[#0f0f1e] border border-[#16213e] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="text-sm text-red-400">{errors.password_confirmation}</div>
                                )}
                            </div>

                            {/* Waiver Agreement */}
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <input
                                        id="waiver_accepted"
                                        name="waiver_accepted"
                                        type="checkbox"
                                        checked={data.waiver_accepted}
                                        onChange={(e) => setData('waiver_accepted', e.target.checked)}
                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#16213e] bg-[#0f0f1e] rounded"
                                        required
                                    />
                                    <div className="text-sm">
                                        <label htmlFor="waiver_accepted" className="font-medium text-gray-300">
                                            I agree to the Waiver and Release of Liability
                                        </label>
                                        <div className="mt-2 p-3 bg-[#0f0f1e] border border-[#16213e] rounded-md text-xs text-gray-400 max-h-32 overflow-y-auto">
                                            <p className="font-semibold text-gray-300 mb-2">PHILIPPINE BASKETBALL LEAGUE - WAIVER AND RELEASE OF LIABILITY</p>
                                            <p className="mb-2">
                                                <strong>ASSUMPTION OF RISK:</strong> I understand that basketball is a contact sport that involves physical exertion and carries inherent risks of injury, including but not limited to sprains, strains, fractures, concussions, and other serious injuries that may result in permanent disability or death.
                                            </p>
                                            <p className="mb-2">
                                                <strong>RELEASE OF LIABILITY:</strong> In consideration of being allowed to participate in the Republiq Basketball League activities, I hereby release, waive, discharge, and covenant not to sue the Republiq Basketball League, its organizers, officials, coaches, volunteers, sponsors, and facilities from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury that may be sustained while participating in league activities.
                                            </p>
                                            <p className="mb-2">
                                                <strong>MEDICAL TREATMENT:</strong> I authorize the Republiq Basketball League representatives to seek emergency medical treatment on my behalf if necessary, and I assume full responsibility for any medical expenses incurred.
                                            </p>
                                            <p className="mb-2">
                                                <strong>PHYSICAL CONDITION:</strong> I certify that I am physically fit and have no medical conditions that would prevent my safe participation in basketball activities. I have consulted with a physician if I have any concerns about my ability to participate.
                                            </p>
                                            <p>
                                                <strong>ACKNOWLEDGMENT:</strong> I have read this waiver and fully understand its contents. I voluntarily agree to the terms and conditions stated above.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {errors.waiver_accepted && (
                                    <div className="text-sm text-red-400">{errors.waiver_accepted}</div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !data.waiver_accepted}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Account...' : 'Join the League'}
                            </button>

                            {/* Links */}
                            <div className="text-center">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
