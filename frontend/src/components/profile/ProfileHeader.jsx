import { Mail, CheckCircle, TrendingUp, Trophy } from 'lucide-react'
import Card from '../ui/Card'

function ProfileHeader({ user, stats }) {
    // Extract user details from the Clerk User object
    const { imageUrl, fullName, primaryEmailAddress } = user

    return (
        <Card className="p-8 h-full flex flex-col items-center text-center space-y-6">

            {/* Avatar with gradient border */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
                <img
                    src={imageUrl}
                    alt={fullName || 'User Avatar'}
                    className="relative w-28 h-28 rounded-full border-4 border-surface object-cover shadow-sm"
                />
                <div className="absolute bottom-1 right-1 bg-accent-500 border-2 border-surface rounded-full p-1.5 shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
            </div>

            {/* User Info */}
            <div>
                <h2 className="text-2xl font-extrabold text-secondary-900 mb-1">{fullName || 'Job Seeker'}</h2>
                <div className="flex items-center justify-center gap-2 text-sm text-secondary-500 font-medium bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-100">
                    <Mail className="w-4 h-4 text-secondary-400" />
                    {primaryEmailAddress?.emailAddress || 'No Email'}
                </div>
            </div>

            <hr className="w-full border-secondary-100" />

            {/* Stats Grid */}
            <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-accent-50 border border-accent-100/50 rounded-xl p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
                    <div className="bg-accent-100 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                        <Trophy className="w-5 h-5 text-accent-600" />
                    </div>
                    <span className="text-3xl font-extrabold text-secondary-900">{stats.bestScore}</span>
                    <span className="text-xs font-semibold text-accent-700 uppercase tracking-widest mt-1">Best Score</span>
                </div>

                <div className="bg-primary-50 border border-primary-100/50 rounded-xl p-4 flex flex-col items-center justify-center transition-transform hover:-translate-y-1">
                    <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-3xl font-extrabold text-secondary-900">{stats.avgScore}</span>
                    <span className="text-xs font-semibold text-primary-700 uppercase tracking-widest mt-1">Avg Score</span>
                </div>
            </div>

            <div className="w-full bg-secondary-900 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <span className="text-sm font-semibold text-secondary-300">Total Analyzed</span>
                <span className="text-xl font-bold bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                    {stats.totalResumes} Resumes
                </span>
            </div>

        </Card>
    )
}

export default ProfileHeader
