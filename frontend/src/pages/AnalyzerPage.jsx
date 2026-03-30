import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'
import { Rocket, Target, LockKeyhole, AlertCircle, Loader2, CheckCircle2, ChevronRight } from 'lucide-react'

import ResumeUpload from '../components/ResumeUpload'
import ResultDashboard from '../components/ResultDashboard'
import Button from '../components/ui/Button'
import { analyzeResume } from '../api/api'

// Loading steps to show progression during API call
const LOADING_STEPS = [
  "Initializing Analysis Engine...",
  "Extracting text from resume...",
  "Comparing against job posting...",
  "Calculating ATS compatibility...",
  "Generating actionable feedback..."
]

function AnalyzerPage() {
  const { user } = useUser()

  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStepIndex, setLoadingStepIndex] = useState(0)
  const [results, setResults] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  function handleFileSelect(file) {
    setResumeFile(file)
    setResults(null)
    setErrorMessage(null)
  }

  // Effect to cycle through loading steps while isLoading is true
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev))
      }, 1500);
    } else {
      setLoadingStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isLoading])

  async function handleAnalyzeClick() {
    if (!resumeFile) {
      setErrorMessage('Please upload your resume file first.')
      return
    }

    setIsLoading(true)
    setErrorMessage(null)
    setResults(null)

    try {
      const analysisData = await analyzeResume(resumeFile, jobDescription, user?.id || '')
      setResults(analysisData)
    } catch (error) {
      const backendError = error.response?.data?.detail
      const networkError = error.message

      setErrorMessage(
        `Analysis failed: ${backendError || networkError || 'Unknown error. Is the backend running?'}`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center font-sans text-secondary-900">
      {/* Light subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none z-0"></div>
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-[120px] pointer-events-none z-0"></div>

      <div className={`relative w-full mx-auto px-4 py-16 sm:py-20 z-10 flex-grow transition-all duration-500 ${results ? 'max-w-[1400px]' : 'max-w-4xl'}`}>

        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-secondary-200 text-primary-700 text-xs font-bold mb-6 shadow-sm uppercase tracking-widest backdrop-blur-md">
            <Target className="w-4 h-4 text-primary-500" /> Deep Analysis
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-900 tracking-tight leading-tight mb-4 drop-shadow-sm">
            Analysis <span className="text-primary-600">Workspace</span>
          </h1>
          <p className="text-lg text-secondary-600 leading-relaxed max-w-xl mx-auto">
            Upload your resume, add your target job description, and let our ML model uncover exactly what's blocking you.
          </p>
        </div>

        <SignedOut>
          <div className="max-w-md mx-auto bg-surface/80 backdrop-blur-xl rounded-xl border border-secondary-200 shadow-sm overflow-hidden text-center animate-fade-in">
            <div className="bg-primary-600 px-6 py-10 relative overflow-hidden border-b border-surface/10">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-sm">
                <LockKeyhole className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="p-8 md:p-10">
              <h2 className="text-2xl font-bold text-secondary-900 mb-3 tracking-tight">Authentication Required</h2>
              <p className="text-secondary-500 text-sm mb-8 leading-relaxed">
                We safely store your score history. Create a free account to unlock unlimited ATS analysis.
              </p>

              <SignInButton mode="modal">
                <Button variant="primary" className="w-full gap-2 text-lg">
                  Sign In to Continue <Target className="w-5 h-5 ml-1" />
                </Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>

          {/* Wrapper for the upload section to give it a nice focused entrance */}
          <div className={`animate-fade-in-up relative z-20 transition-all duration-700 ${(results || isLoading) ? 'opacity-50 scale-95 blur-[2px] pointer-events-none' : ''} ${results ? 'hidden md:block' : ''}`} style={{ animationDelay: '100ms' }}>
            <ResumeUpload
              onFileSelect={handleFileSelect}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
            />
          </div>

          {/* Analyze Button & Loading Progression */}
          {!results && (
            <div className="flex flex-col items-center mt-12 mb-16 animate-fade-in-up relative z-20" style={{ animationDelay: '200ms' }}>
              {isLoading ? (
                <div className="w-full max-w-md bg-surface backdrop-blur-xl border border-secondary-200 rounded-xl p-8 shadow-sm overflow-hidden relative">
                  {/* Glowing background effect for loader container */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 to-primary-500/5 animate-pulse"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-8" />

                    <div className="w-full space-y-5">
                      {LOADING_STEPS.map((step, index) => (
                        <div key={index} className={`flex items-center gap-3 transition-opacity duration-500 ${index === loadingStepIndex ? 'opacity-100 scale-105 transform' : index < loadingStepIndex ? 'opacity-50' : 'opacity-30'}`}>
                          {index < loadingStepIndex ? (
                            <CheckCircle2 className="w-6 h-6 text-accent-500" />
                          ) : index === loadingStepIndex ? (
                            <ChevronRight className="w-6 h-6 text-primary-600 animate-pulse" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-secondary-300"></div>
                          )}
                          <span className={`text-base font-semibold ${index === loadingStepIndex ? 'text-primary-900 bg-primary-50/50 px-3 py-1 rounded-full w-full border border-primary-100/50' : 'text-secondary-500'}`}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`relative group w-full sm:w-auto ${!resumeFile ? 'cursor-not-allowed' : ''}`}>
                  {/* Glowing background that only appears when a file is ready */}
                  {resumeFile && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-primary-500 to-primary-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 pulse pointer-events-none"></div>
                  )}

                  <Button
                    onClick={handleAnalyzeClick}
                    className={`gap-3 px-10 py-5 w-full text-lg font-extrabold group ${!resumeFile ? 'opacity-60' : ''}`}
                  >
                    <Rocket className={`w-6 h-6 ${resumeFile ? 'group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform' : 'opacity-50'}`} />
                    Initialize Depth Scan
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="max-w-2xl mx-auto bg-rose-50/80 backdrop-blur-md border border-rose-200 rounded-xl p-6 mb-12 text-center animate-fade-in shadow-sm">
              <div className="flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-8 h-8 text-rose-500" />
                <div>
                  <h3 className="text-rose-900 font-bold mb-1 tracking-tight">Analysis Interrupted</h3>
                  <p className="text-rose-700 text-sm">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Dashboard appears here */}
          {results && (
            <div className="animate-fade-in-up relative z-20 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Panel (Resume Viewer) */}
                <div className="hidden lg:block relative">
                  <div className="sticky top-8 bg-surface rounded-xl border border-secondary-200 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
                    <div className="bg-secondary-50 px-5 py-4 border-b border-secondary-200 flex items-center justify-between shrink-0">
                      <h3 className="font-bold text-secondary-900">Resume Preview</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-primary-100 text-primary-700 rounded-full truncate max-w-[200px]">
                        {resumeFile?.name || 'Uploaded Resume'}
                      </span>
                    </div>
                    <div className="flex-grow p-4 bg-secondary-50/50">
                      {resumeFile ? (
                        <object
                          data={URL.createObjectURL(resumeFile)}
                          type={resumeFile.type}
                          className="w-full h-full rounded shadow-sm border border-secondary-200 bg-surface"
                        >
                          <div className="flex flex-col items-center justify-center h-full text-secondary-500">
                            <p>Preview not available for this file type.</p>
                          </div>
                        </object>
                      ) : (
                        <div className="flex items-center justify-center h-full text-secondary-400">
                          No file selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Panel (Analysis Dashboard) */}
                <div className="space-y-6 pb-20">
                  <ResultDashboard results={results} filename={resumeFile?.name || 'resume'} />
                </div>

              </div>
            </div>
          )}

        </SignedIn>

      </div>
    </div>
  )
}

export default AnalyzerPage
