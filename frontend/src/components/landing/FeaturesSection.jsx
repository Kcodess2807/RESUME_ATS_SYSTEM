import { Gauge, KeyRound, Sparkles, PieChart } from 'lucide-react'

const FEATURES = [
    {
        icon: Gauge,
        title: 'ATS Score',
        description: 'Get a score out of 100 showing how well your resume will pass Applicant Tracking Systems used by top companies.',
        gradient: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50 text-blue-600'
    },
    {
        icon: KeyRound,
        title: 'Keyword Match',
        description: 'See which keywords from the job description appear in your resume and which ones are missing — with fix suggestions.',
        gradient: 'from-blue-500 to-blue-500',
        bgColor: 'bg-blue-50 text-blue-600'
    },
    {
        icon: Sparkles,
        title: 'Smart Suggestions',
        description: 'Get personalized tips on content, formatting, and keyword coverage so you can improve your score immediately.',
        gradient: 'from-amber-400 to-orange-500',
        bgColor: 'bg-amber-50 text-amber-600'
    },
    {
        icon: PieChart,
        title: 'Resume Insights',
        description: 'View a detailed breakdown showing exactly which areas (formatting, keywords, content, skills) bring your score up or down.',
        gradient: 'from-emerald-400 to-teal-500',
        bgColor: 'bg-emerald-50 text-emerald-600'
    },
]

function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Features</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                        Everything you need to land more interviews
                    </h3>
                    <p className="text-lg text-slate-500">
                        Our AI-powered platform provides deep insights into your resume, helping you tailor it perfectly to any job description.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="group relative bg-white p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-sm hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Gradient Accent on Hover */}
                                <div className={`absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                                <p className="text-slate-500 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
