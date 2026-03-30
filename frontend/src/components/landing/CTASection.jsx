import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'

function CTASection() {
    return (
        <section className="relative overflow-hidden py-24 bg-slate-900 mt-0">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 -m-32 w-[500px] h-[500px] rounded-full bg-blue-500/30 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 -m-32 w-[500px] h-[500px] rounded-full bg-blue-500/30 blur-[120px]"></div>

            <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    Start optimizing your resume today
                </h2>
                <p className="text-xl text-blue-200 mb-10 leading-relaxed max-w-2xl mx-auto">
                    Join thousands of job seekers who have successfully navigated Applicant Tracking Systems and landed their dream jobs.
                </p>

                <SignedIn>
                    <Link
                        to="/analyze"
                        className="inline-block bg-white text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                    >
                        Go to Dashboard
                    </Link>
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal">
                        <button className="bg-white text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
                            Analyze Your Resume Now
                        </button>
                    </SignInButton>
                </SignedOut>
            </div>
        </section>
    )
}

export default CTASection
