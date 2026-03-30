import { useState } from 'react'
import { PieChart, Pie, Cell } from 'recharts'
import {
  FileDown, Loader2, AlertTriangle, CheckCircle2,
  ChevronDown, ChevronUp, Layout, FileText, PenTool, Award, Info, Search, Zap, ListChecks
} from 'lucide-react'
import { downloadCurrentPDF } from '../api/api'
import Card from './ui/Card'
import Button from './ui/Button'

// Helper functions for colors and statuses
function getStatus(score) {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-700 bg-green-50 border-green-200', barInfo: 'bg-green-500' }
  if (score >= 60) return { label: 'Good', color: 'text-amber-700 bg-amber-50 border-amber-200', barInfo: 'bg-amber-500' }
  return { label: 'Needs Work', color: 'text-red-700 bg-red-50 border-red-200', barInfo: 'bg-red-500' }
}

function GaugeChart({ score }) {
  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];
  let scoreColor = '#2563eb'; // blue-600
  if (score >= 80) scoreColor = '#22c55e'; // green-500
  else if (score < 60) scoreColor = '#ef4444'; // red-500

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="relative w-[240px] h-[140px] flex items-center justify-center">
        <PieChart width={240} height={130}>
          <Pie
            data={chartData}
            cx={120}
            cy={120}
            innerRadius={85}
            outerRadius={110}
            startAngle={180}
            endAngle={0}
            dataKey="value"
            strokeWidth={0}
            cornerRadius={4}
            paddingAngle={2}
          >
            <Cell fill={scoreColor} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-secondary-900 tracking-tight leading-none">
              {score}
            </span>
            <span className="text-lg text-secondary-400 font-medium tracking-normal leading-none">
              / 100
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExpandableCard({ title, content, type, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isWarning = type === 'warning';

  return (
    <Card className="mb-4 transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between bg-surface hover:bg-background transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-100 text-amber-600' : 'bg-primary-100 text-primary-600'}`}>
            {isWarning ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <span className="font-bold text-secondary-800 text-left pr-4">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-secondary-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-secondary-400 shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-secondary-100 bg-secondary-50/50">
          {typeof content === 'string' ? (
            <p className="text-secondary-600 leading-relaxed text-sm">{content}</p>
          ) : (
            content
          )}
        </div>
      )}
    </Card>
  )
}

function ResultDashboard({ results, filename = 'resume' }) {
  const [pdfLoading, setPdfLoading] = useState(false)

  async function handleDownloadPDF() {
    setPdfLoading(true)
    try {
      await downloadCurrentPDF(results, filename.replace(/\.pdf$/i, ''))
    } catch (err) {
      console.error('PDF download failed:', err)
    } finally {
      setPdfLoading(false)
    }
  }

  const overallScore = results?.ATS_score || results?.ats_score || 0;
  let summaryMessage = "Excellent! Your resume is well-optimized for ATS systems.";
  if (overallScore < 90 && overallScore >= 70) summaryMessage = "Your resume should perform well with most ATS systems.";
  else if (overallScore < 70 && overallScore >= 50) summaryMessage = "Your resume has good potential but needs targeted improvements in keywords and skills.";
  else if (overallScore < 50) summaryMessage = "Your resume needs significant updates to safely pass standard ATS checks.";

  const compScores = results?.component_scores || {};

  // Convert raw scores (0-20, 0-25, etc.) to percentages (0-100)
  const getPct = (val, max) => {
    if (!val || !max) return 0;
    const percentage = Math.round((val / max) * 100);
    return Math.min(100, Math.max(0, percentage)); // Clamp between 0-100
  };

  const components = [
    { name: "Tone & Style", score: getPct(compScores.formatting || 0, 20), icon: <PenTool className="w-5 h-5" /> },
    { name: "Content", score: getPct(compScores.content || 0, 25), icon: <FileText className="w-5 h-5" /> },
    { name: "Keywords", score: getPct(compScores.keywords || 0, 25), icon: <Search className="w-5 h-5" /> },
    { name: "Structure", score: getPct(compScores.ats_compatibility || 0, 15), icon: <Layout className="w-5 h-5" /> },
    { name: "Skills", score: getPct(compScores.skill_validation || 0, 15), icon: <Award className="w-5 h-5" /> }
  ]

  // ── Read NEW fields first, then fall back to old ones ──
  const issuesSummary = results?.issues_summary || results?.critical_issues || [];
  const detailedFeedback = results?.detailed_feedback || [];
  const jdMatch = results?.jd_match_analysis || results?.jd_comparison || null;
  const strengths = results?.strengths || [];
  const skills = results?.skills || [];
  const matchedKeywords = results?.matched_keywords || [];
  const missingKeywords = results?.missing_keywords || [];

  return (
    <div className="space-y-8 font-sans animate-fade-in pb-10">

      {/* Header with Download */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-secondary-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Resume Review</h1>
          <p className="text-secondary-500 mt-1 font-medium">Detailed analysis & actionable feedback</p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          disabled={pdfLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
          Export Report
        </Button>
      </div>

      {/* Top Section: Score Gauge */}
      <Card className="p-8 flex flex-col items-center relative overflow-visible">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h2 className="text-lg font-bold text-secondary-800 mb-2 tracking-wide uppercase">Your Resume Score</h2>

        <GaugeChart score={overallScore} />

        <p className="text-secondary-600 font-medium text-center max-w-sm mt-3 text-sm">
          {summaryMessage}
        </p>
      </Card>

      {/* Component Scoring */}
      <div>
        <h3 className="text-xl font-bold text-secondary-900 mb-5">Component Scoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {components.map((comp, idx) => {
            const status = getStatus(comp.score);
            return (
              <Card key={idx} className="p-6 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3 text-secondary-800 font-bold">
                    <span className="p-2.5 bg-background text-secondary-600 rounded-lg border border-secondary-100 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      {comp.icon}
                    </span>
                    <span className="text-lg">{comp.name}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-grow bg-secondary-100 rounded-full h-2 shadow-inner overflow-hidden">
                    <div
                      className={`h-full rounded-full ${status.barInfo} transition-all duration-1000 ease-out`}
                      style={{ width: `${comp.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-secondary-700 w-12 text-right tabular-nums">{comp.score}/100</span>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* ATS Score Section Highlight */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-md p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="absolute right-0 top-0 w-48 h-full bg-white/10 skew-x-12 transform origin-top pointer-events-none group-hover:scale-110 transition-transform"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary-500/50 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <h3 className="text-2xl font-extrabold flex items-center gap-2 mb-2">
            ATS Score <span className="opacity-75 font-medium ml-2">—</span> <span className="text-xl">{overallScore} / 100</span>
          </h3>
          <p className="text-primary-100 text-sm max-w-lg leading-relaxed">
            How well your resume passes through Applicant Tracking Systems.
            This reflects keyword matches, formatting compatibility, and structural integrity.
          </p>
        </div>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xl font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Strengths
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {strengths.map((s, idx) => (
              <div key={idx} className="bg-surface border border-secondary-200 rounded-xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="bg-green-100 p-2 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-secondary-700 text-sm font-medium leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues Summary */}
      {issuesSummary.length > 0 && (
        <div className="pt-2">
          <h3 className="text-xl font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Issues Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {issuesSummary.map((issue, idx) => (
              <div key={idx} className="bg-surface border border-secondary-200 rounded-xl p-4 flex items-start gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                <div className="bg-amber-100 p-2 rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-secondary-700 text-sm font-medium leading-relaxed">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Feedback — structured issue cards */}
      {detailedFeedback.length > 0 && (
        <div className="pt-4">
          <h3 className="text-xl font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-500" /> Detailed Feedback
          </h3>
          <div className="space-y-4">
            {detailedFeedback.map((fb, idx) => {
              const severityColor = fb.severity_level === 'High'
                ? 'bg-red-50 text-red-700 border-red-200'
                : fb.severity_level === 'Moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-primary-50 text-primary-700 border-primary-200'
              const impactColor = fb.ats_impact === 'High'
                ? 'bg-red-50 text-red-700 border-red-200'
                : fb.ats_impact === 'Medium'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-secondary-50 text-secondary-700 border-secondary-200'

              const contentJSX = (
                <div className="space-y-4">
                  {/* Severity badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${severityColor}`}>
                      Severity: {fb.severity_level}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${impactColor}`}>
                      ATS Impact: {fb.ats_impact}
                    </span>
                  </div>

                  {/* What the issue is */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-1">What is the issue?</p>
                    <p className="text-secondary-700 text-sm leading-relaxed break-words">{fb.explanation}</p>
                  </div>

                  {/* Where it appears */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-1">Where it appears</p>
                    <p className="text-secondary-600 text-sm leading-relaxed italic break-words">{fb.where_it_appears}</p>
                  </div>

                  {/* Action Steps — most prominent section */}
                  {fb.action_items && fb.action_items.length > 0 ? (
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-primary-700 mb-3 flex items-center gap-1.5">
                        <ListChecks className="w-4 h-4" /> Steps to Fix
                      </p>
                      <ul className="space-y-2">
                        {fb.action_items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="text-sm text-primary-900 leading-relaxed font-medium break-words">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-1">How to fix</p>
                      <p className="text-secondary-700 text-sm leading-relaxed break-words">{fb.how_to_fix}</p>
                    </div>
                  )}

                  {/* Example Improvement */}
                  <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-2">Example Improvement</p>
                    <pre className="text-sm text-secondary-700 whitespace-pre-wrap font-sans leading-relaxed break-words">{fb.example_improvement}</pre>
                  </div>
                </div>
              )

              return (
                <ExpandableCard
                  key={idx}
                  title={fb.issue_title}
                  content={contentJSX}
                  type={fb.severity_level === 'High' ? 'warning' : 'info'}
                  defaultOpen={idx === 0}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* JD Match Analysis */}
      {jdMatch && (
        <div className="pt-4">
          <h3 className="text-xl font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-500" /> Job Description Match
          </h3>
          <div className="bg-surface rounded-xl shadow-sm border border-secondary-200 p-6 space-y-5">
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[150px]">
                <p className="text-xs uppercase tracking-widest text-secondary-500 font-bold mb-1">Match Score</p>
                <p className="text-3xl font-extrabold text-secondary-900">{jdMatch.match_percentage || 0}%</p>
              </div>
              <div className="flex-1 min-w-[150px]">
                <p className="text-xs uppercase tracking-widest text-secondary-500 font-bold mb-1">Semantic Similarity</p>
                <p className="text-3xl font-extrabold text-secondary-900">{((jdMatch.semantic_similarity || 0) * 100).toFixed(1)}%</p>
              </div>
            </div>

            {jdMatch.matched_keywords?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-green-700 mb-2">✅ Matched Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {jdMatch.matched_keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {jdMatch.missing_keywords?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-red-700 mb-2">❌ Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {jdMatch.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {jdMatch.skills_gap?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-amber-700 mb-2">⚠️ Skills Gap</p>
                <div className="flex flex-wrap gap-2">
                  {jdMatch.skills_gap.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">{kw}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detected Skills */}
      {skills.length > 0 && (
        <div className="pt-4">
          <h3 className="text-xl font-bold text-secondary-900 mb-5 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" /> Detected Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-surface text-secondary-700 text-xs font-bold rounded-full border border-secondary-200 shadow-sm hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default ResultDashboard

