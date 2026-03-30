import { useState } from 'react'
import { Search, FolderOpen, FileText, Download, Trash2, Loader2 } from 'lucide-react'
import ResumeCard from './ResumeCard'
import Card from '../ui/Card'
import { downloadHistoryPDF } from '../../api/api'

function ResumeHistoryTable({ history, userId, onDelete }) {
    const [search, setSearch] = useState('')
    const [downloadingId, setDownloadingId] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    const filtered = history.filter(item =>
        item.filename.toLowerCase().includes(search.toLowerCase())
    )

    const getScoreBadge = (score) => {
        if (score >= 80) return 'bg-accent-100 text-accent-800 border-accent-200'
        if (score >= 60) return 'bg-amber-100 text-amber-800 border-amber-200'
        return 'bg-rose-100 text-rose-800 border-rose-200'
    }

    const formatDate = (iso) => {
        try {
            return new Date(iso).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            })
        } catch {
            return iso
        }
    }

    const handleDownload = async (item) => {
        setDownloadingId(item.id)
        try {
            await downloadHistoryPDF(item.id, userId, item.filename)
        } catch (err) {
            console.error('PDF download failed:', err)
        } finally {
            setDownloadingId(null)
        }
    }

    const handleDelete = async (item) => {
        setDeletingId(item.id)
        try {
            await onDelete(item.id)
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Card className="p-4 sm:p-8 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2 sm:px-0">
                <div>
                    <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                        <FolderOpen className="w-5 h-5 text-primary-500" />
                        Resume History
                    </h2>
                    <p className="text-secondary-500 text-sm mt-1">
                        Access past performance reports and download detailed PDF reports.
                    </p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search resumes..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-secondary-200 rounded-xl bg-background text-sm text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-surface transition-all shadow-sm"
                    />
                    <Search className="w-4 h-4 text-secondary-400 absolute left-3.5 top-2.5" />
                </div>
            </div>

            {filtered.length > 0 ? (
                <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-secondary-200 bg-secondary-50/50">
                                    <th className="font-semibold text-secondary-600 text-sm py-4 px-6 rounded-tl-xl">Resume File</th>
                                    <th className="font-semibold text-secondary-600 text-sm py-4 px-6">ATS Score</th>
                                    <th className="font-semibold text-secondary-600 text-sm py-4 px-6">Keyword Match</th>
                                    <th className="font-semibold text-secondary-600 text-sm py-4 px-6">Missing Keywords</th>
                                    <th className="font-semibold text-secondary-600 text-sm py-4 px-6">Date</th>
                                    <th className="font-semibold text-secondary-600 text-sm py-4 px-6 rounded-tr-xl text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((item) => (
                                    <tr key={item.id} className="border-b border-secondary-100 hover:bg-secondary-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 border border-primary-100/50">
                                                    <FileText className="w-5 h-5 text-primary-600" />
                                                </div>
                                                <p className="font-bold text-secondary-800 truncate max-w-xs text-sm">
                                                    {item.filename}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center justify-center border font-bold px-3 py-1 rounded-full text-sm shadow-sm ${getScoreBadge(item.ats_score)}`}>
                                                {Math.round(item.ats_score)}
                                            </span>
                                        </td>

                                        <td className="py-4 px-6 font-semibold text-secondary-700 text-sm">
                                            {Math.round(item.keyword_match)}%
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                {(item.missing_keywords || []).slice(0, 2).map((kw, i) => (
                                                    <span key={i} className="bg-secondary-100 text-secondary-600 border border-secondary-200 text-xs px-2 py-0.5 rounded-md font-medium">
                                                        {kw}
                                                    </span>
                                                ))}
                                                {(item.missing_keywords || []).length > 2 && (
                                                    <span className="text-xs font-semibold text-secondary-400 pt-0.5">
                                                        +{item.missing_keywords.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-4 px-6 text-sm text-secondary-500 font-medium whitespace-nowrap">
                                            {formatDate(item.created_at)}
                                        </td>

                                        <td className="py-4 px-6">
                                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDownload(item)}
                                                    disabled={downloadingId === item.id}
                                                    className="p-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-transparent hover:border-primary-200 disabled:opacity-50"
                                                    title="Download PDF Report"
                                                >
                                                    {downloadingId === item.id
                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                        : <Download className="w-4 h-4" />
                                                    }
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item)}
                                                    disabled={deletingId === item.id}
                                                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-transparent hover:border-rose-200 disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingId === item.id
                                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                                        : <Trash2 className="w-4 h-4" />
                                                    }
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                        {filtered.map(item => (
                            <ResumeCard
                                key={item.id}
                                item={item}
                                userId={userId}
                                onDelete={onDelete}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-secondary-400">
                    <FolderOpen className="w-16 h-16 mb-4 text-secondary-200" />
                    <p className="text-lg font-semibold text-secondary-600">
                        {history.length === 0 ? 'No resumes analyzed yet' : 'No results match your search'}
                    </p>
                    <p className="text-sm mt-1">
                        {history.length === 0
                            ? 'Upload your first resume to see history here.'
                            : 'Try a different search term.'}
                    </p>
                </div>
            )}
        </Card>
    )
}

export default ResumeHistoryTable
