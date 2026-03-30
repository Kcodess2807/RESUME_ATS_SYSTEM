import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Rocket, TrendingUp, Star, Users, Target, User, CheckCircle2 } from 'lucide-react'
function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white selection:bg-indigo-100 selection:text-indigo-900">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-400/10 blur-[100px] pointer-events-none mix-blend-multiply"></div>

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgNDBoNDBWMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgLjVoNDBDNDAgLjUgMzkgLjUgMzkuNSAuNXoiIGZpbGw9IiNlN2U1ZTQiIGZpbGwtb3BhY2l0eT0iMC4zIi8+CjxwYXRoIGQ9Ik0uNSAwdi41QzAuNSAxIC41IDEgLjUgMXoiIGZpbGw9IiNlN2U1ZTQiIGZpbGwtb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPg==')] opacity-50 z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* LEFT COLUMN: Copy & CTA */}
                    <div className="max-w-2xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/50 border border-indigo-200/50 text-indigo-700 text-sm font-semibold mb-6 shadow-sm backdrop-blur-sm">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                            </span>
                            AI-Powered Resume Analysis
                        </div>

                        <h1 className="text-5xl lg:text-6xl xl:text-[4.5rem] font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900 drop-shadow-sm">
                            Save hours by using <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 inline-block transform hover:scale-105 transition-transform duration-300">AI</span> for your job hunt
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                            This AI-powered resume analyzer helps candidates improve their resumes and pass ATS screening systems used by recruiters. Land more interviews and beat the ATS.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <SignedIn>
                                <Link
                                    to="/analyze"
                                    className="px-8 py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                                >
                                    <Rocket className="w-5 h-5" /> Analyze Your Resume
                                </Link>
                            </SignedIn>
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="px-8 py-4 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1">
                                        <Rocket className="w-5 h-5" /> Analyze Your Resume
                                    </button>
                                </SignInButton>
                            </SignedOut>

                            <Link
                                to="/analyze"
                                className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-sm group"
                            >
                                <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Check Your ATS Score
                            </Link>
                        </div>

                        {/* TRUST METRICS (3 cards) */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                                    <Star className="w-5 h-5 text-white fill-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-extrabold text-slate-900 leading-tight">4.9/5</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Rating</p>
                                </div>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-extrabold text-slate-900 leading-tight">10K+</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Interviews Landed</p>
                                </div>
                            </div>
                            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 border border-white shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-lg font-extrabold text-slate-900 leading-tight">90%</p>
                                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">ATS Accuracy</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Product Preview Card */}
                    <div className="relative w-full max-w-lg mx-auto lg:ml-auto lg:mr-0 mt-12 lg:mt-0 animate-float-slow">

                        {/* Decorative floating checkmark */}
                        <div className="absolute -top-6 -left-6 bg-white rounded-full p-2.5 shadow-lg border border-slate-100 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="bg-indigo-100 rounded-full p-1.5">
                                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>

                        {/* Decorative floating chart icon */}
                        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-3 shadow-lg border border-slate-100 z-20 animate-pulse" style={{ animationDuration: '4s' }}>
                            <div className="bg-purple-100 rounded-xl p-2">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>

                        {/* Main Preview Card */}
                        <div className="bg-white rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-200/60 overflow-visible relative rotate-[-1deg] transform transition-transform hover:rotate-0 duration-500">

                            {/* Card Accent Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl"></div>

                            {/* ATS Score Badge (Floating on Top Right corner) */}
                            <div className="absolute -top-6 -right-6 bg-emerald-500 text-white w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl shadow-emerald-500/30 border-4 border-white z-30 transform hover:scale-105 transition-transform cursor-default">
                                <span className="text-3xl font-black leading-none tracking-tighter">92</span>
                                <span className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-90">ATS Score</span>
                            </div>

                            <div className="p-8">
                                {/* Profile Header */}
                                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-inner">
                                        <User className="w-8 h-8 text-white opacity-90" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">John Doe</h3>
                                        <p className="text-slate-500 font-medium text-sm">Senior Software Engineer</p>
                                    </div>
                                </div>

                                {/* Experience Section */}
                                <div className="mb-8">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h4>

                                    <div className="relative pl-6 border-l-2 border-slate-100 space-y-6">
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                                            <h5 className="font-bold text-slate-800 text-[15px]">Senior Software Engineer</h5>
                                            <p className="text-sm font-semibold text-indigo-600 mb-1.5">at Tech Corp</p>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">
                                                Led development of AI-powered features that improved user engagement by 40%. Architected scalable cloud solutions.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white"></div>
                                            <h5 className="font-bold text-slate-800 text-[15px]">Software Engineer</h5>
                                            <p className="text-sm font-semibold text-slate-600 mb-1.5">at Startup Inc</p>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2">
                                                Built scalable backend systems using Python and AWS. Reduced latency by 200ms across all endpoints.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Section */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Python', 'React', 'AWS', 'ML', 'Docker', 'Kubernetes'].map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[13px] font-semibold rounded-lg border border-indigo-100/50"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
