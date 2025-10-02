import { Head, useForm, Link } from '@inertiajs/react'
import { Trophy, Users, Target, Zap } from 'lucide-react'

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

            <div className="min-h-screen basketball-court-bg flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto basketball-card-shadow border-2 border-orange-200 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="text-center bg-gradient-to-r from-blue-500 to-orange-500 text-white p-6">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                <Trophy className="h-7 w-7 text-white basketball-bounce" />
                            </div>
                            <div className="text-left">
                                <h1 className="text-white text-xl font-semibold">Join the League</h1>
                                <p className="text-blue-100 text-sm">Republiq Basketball League</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                        <form onSubmit={submit} className="space-y-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && (
                                    <div className="text-sm text-red-600">{errors.name}</div>
                                )}
                            </div>

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

                            {/* Phone */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Phone (Optional)
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    placeholder="Enter your phone number"
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && (
                                    <div className="text-sm text-red-600">{errors.phone}</div>
                                )}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="">Select your role</option>
                                    <option value="player">Player</option>
                                    <option value="coach">Coach</option>
                                    <option value="referee">Referee</option>
                                </select>
                                {errors.role && (
                                    <div className="text-sm text-red-600">{errors.role}</div>
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
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-sm text-red-600">{errors.password}</div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full px-3 py-2 border border-orange-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                                    autoComplete="new-password"
                                    placeholder="Confirm your password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="text-sm text-red-600">{errors.password_confirmation}</div>
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
                                        className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-orange-300 rounded"
                                        required
                                    />
                                    <div className="text-sm">
                                        <label htmlFor="waiver_accepted" className="font-medium text-gray-700">
                                            I agree to the Waiver and Release of Liability
                                        </label>
                                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 max-h-32 overflow-y-auto">
                                            <p className="font-semibold text-gray-800 mb-2">PHILIPPINE BASKETBALL LEAGUE - WAIVER AND RELEASE OF LIABILITY</p>
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
                                    <div className="text-sm text-red-600">{errors.waiver_accepted}</div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing || !data.waiver_accepted}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Creating Account...' : 'Join the League'}
                            </button>

                            {/* Links */}
                            <div className="text-center">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Already have an account? Sign in
                                </Link>
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
