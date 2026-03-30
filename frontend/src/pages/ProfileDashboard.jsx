import { useState, useEffect, useCallback } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'
import { Plus, LayoutDashboard, LockKeyhole, Loader2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

import ProfileHeader from '../components/profile/ProfileHeader'
import ScoreTrendChart from '../components/profile/ScoreTrendChart'
import ResumeHistoryTable from '../components/profile/ResumeHistoryTable'
import { getUserHistory, deleteAnalysis } from '../api/api'

function ProfileDashboard() {
    const { isLoaded, isSignedIn, user } = useUser()

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [fetchError, setFetchError] = useState(null)

    // Fetch history from MongoDB when the user is ready
    const fetchHistory = useCallback(async () => {
        if (!user?.id) return
        setLoading(true)
        setFetchError(null)
        try {
            const data = await getUserHistory(user.id)
            setHistory(data)
        } catch (err) {
            console.error('Failed to load history:', err)
            setFetchError('Could not load history. Is the backend running?')
        } finally {
            setLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        if (isLoaded && isSignedIn) fetchHistory()
    }, [isLoaded, isSignedIn, fetchHistory])

    // Delete entry from MongoDB then remove from local state
    const handleDelete = async (id) => {
        try {
            await deleteAnalysis(id, user.id)
            setHistory(prev => prev.filter(item => item.id !== id))
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }

    // Derived stats for the ProfileHeader card
    const totalResumes = history.length
    const avgScore = history.length > 0
        ? Math.round(history.reduce((sum, item) => sum + item.ats_score, 0) / history.length)
        : 0
    const bestScore = history.length > 0
        ? Math.max(...history.map(item => item.ats_score))
        : 0

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
            <div className="absolute top-0 right-0 -m-32 w-96 h-96 rounded-full bg-accent-500/10 blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 -m-32 w-96 h-96 rounded-full bg-primary-500/10 blur-[100px] pointer-events-none z-0"></div>

            <div className="relative w-full max-w-6xl mx-auto px-4 py-12 z-10 flex-grow">

                {/* Page Title & New Scan Button */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 animate-fade-in-up">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-secondary-200 text-secondary-600 text-xs font-bold mb-3 shadow-sm uppercase tracking-widest">
                            <LayoutDashboard className="w-3 h-3 text-accent-500" /> User Dashboard
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-secondary-900 tracking-tight">
                            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 to-primary-500">Overview</span>
                        </h1>
                    </div>

                    <SignedIn>
                        <Link
                            to="/analyze"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:-translate-y-1 hover:shadow-glow px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            <Plus className="w-5 h-5" /> Analyze New Resume
                        </Link>
                    </SignedIn>
                </div>

                {/* Logged Out View */}
                <SignedOut>
                    <Card className="max-w-md mx-auto overflow-hidden text-center animate-fade-in mt-20">
                        <div className="bg-gradient-to-r from-accent-500 to-primary-500 px-6 py-10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mx-auto flex items-center justify-center shadow-sm">
                                <LockKeyhole className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="p-8 md:p-10">
                            <h2 className="text-2xl font-bold text-secondary-800 mb-3">Dashboard Locked</h2>
                            <p className="text-secondary-500 text-sm mb-8 leading-relaxed">
                                Sign in to view your analysis history, track your improvement over time, and download PDF reports.
                            </p>
                            <SignInButton mode="modal">
                                <Button variant="primary" className="w-full gap-2 text-lg">
                                    Sign In to Access
                                </Button>
                            </SignInButton>
                        </div>
                    </Card>
                </SignedOut>

                {/* Logged In View */}
                <SignedIn>
                    {isLoaded && user && (
                        <div className="space-y-8">

                            {/* Top Row: Profile Card & Score Trend Chart */}
                            <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <div className="lg:col-span-1">
                                    <ProfileHeader
                                        user={user}
                                        stats={{ totalResumes, avgScore, bestScore }}
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <ScoreTrendChart data={history} />
                                </div>
                            </div>

                            {/* Loading state */}
                            {loading && (
                                <div className="flex items-center justify-center gap-3 py-10 text-slate-500">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm font-medium">Loading your history...</span>
                                </div>
                            )}

                            {/* Error state */}
                            {fetchError && !loading && (
                                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-center gap-3 text-rose-700">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <span className="text-sm font-semibold">{fetchError}</span>
                                </div>
                            )}

                            {/* History Table */}
                            {!loading && !fetchError && (
                                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                    <ResumeHistoryTable
                                        history={history}
                                        userId={user.id}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            )}

                        </div>
                    )}
                </SignedIn>

            </div>
        </div>
    )
}

export default ProfileDashboard
