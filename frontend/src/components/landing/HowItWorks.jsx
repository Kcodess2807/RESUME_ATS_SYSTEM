import { UploadCloud, Bot, FileCheck } from 'lucide-react'

const STEPS = [
    {
        id: 1,
        title: 'Upload Resume',
        description: 'Upload your current resume in PDF format along with the job description you are targeting.',
        icon: UploadCloud,
    },
    {
        id: 2,
        title: 'AI Analysis',
        description: 'Our proprietary ML model scans your resume against the job description to find missing keywords and formatting issues.',
        icon: Bot,
    },
    {
        id: 3,
        title: 'Get Optimization Tips',
        description: 'Receive an instant ATS score and a tailored checklist of actionable improvements to boost your chances.',
        icon: FileCheck,
    }
]

function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-500">
                        Optimize your resume in three simple steps.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line for desktop */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 transform -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className="relative flex flex-col items-center text-center group">
                                    <div className="w-24 h-24 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center mb-6 relative group-hover:scale-105 transition-transform duration-300">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                        <Icon className="w-10 h-10 text-blue-600 group-hover:text-blue-600 transition-colors" />

                                        {/* Step Number Badge */}
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-4 border-slate-50 text-white font-bold flex items-center justify-center text-xs shadow-sm group-hover:bg-blue-600 transition-colors">
                                            {step.id}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
