import { Trophy, Shield, Target, Users, Zap } from 'lucide-react'

export default function AuthLayout({ children, title, subtitle, gradientFrom = 'orange', gradientTo = 'red' }) {
    const gradientClass = `bg-gradient-to-r from-${gradientFrom}-500 to-${gradientTo}-500`
    
    return (
        <div className="min-h-screen basketball-court-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto basketball-card-shadow border-2 border-orange-200 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden">
                {/* Header */}
                <div className={`text-center ${gradientClass} text-white p-6`}>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                            <Trophy className="h-7 w-7 text-white basketball-bounce" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-white text-xl font-semibold">{title}</h1>
                            <p className="text-white/90 text-sm">{subtitle}</p>
                        </div>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
            
            {/* Basketball court background styles */}
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
    )
}