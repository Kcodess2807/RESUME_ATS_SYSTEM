import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Sends resume file + job description + optional Clerk user ID to the backend.
// When user_id is provided the backend auto-saves the result to MongoDB.
export async function analyzeResume(resumeFile, jobDescription, userId = '') {
  const formData = new FormData()
  formData.append('resume', resumeFile)
  formData.append('job_description', jobDescription || '')
  formData.append('user_id', userId || '')

  // Do NOT set Content-Type manually — axios auto-sets multipart/form-data
  // with the correct boundary when the body is FormData. Overriding it
  // removes the boundary and breaks the server's ability to parse the body.
  const response = await axios.post(`${API_BASE_URL}/api/v1/analyze-resume`, formData)
  return response.data
}


//User History
export async function getUserHistory(userId) {
  const response = await axios.get(`${API_BASE_URL}/api/v1/history`, {
    headers: { 'X-User-ID': userId },
  })
  return response.data   // array of HistoryEntry objects
}


//Delete Analysis
export async function deleteAnalysis(id, userId) {
  const response = await axios.delete(`${API_BASE_URL}/api/v1/history/${id}`, {
    headers: { 'X-User-ID': userId },
  })
  return response.data
}


//Download PDF for the current (live) analysis
// Posts the full AnalysisResponse JSON to /generate-pdf and triggers a download.
export async function downloadCurrentPDF(analysisData, resumeFilename = 'resume') {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/generate-pdf`,
    analysisData,
    { responseType: 'blob' }
  )
  _triggerDownload(response.data, `ats_report_${resumeFilename}.pdf`)
}


//Download PDF for a stored (history) analysis
export async function downloadHistoryPDF(id, userId, filename = 'resume') {
  const response = await axios.get(`${API_BASE_URL}/api/v1/history/${id}/pdf`, {
    headers: { 'X-User-ID': userId },
    responseType: 'blob',
  })
  _triggerDownload(response.data, `ats_report_${filename}.pdf`)
}


//Health check 
export async function checkHealth() {
  const response = await axios.get(`${API_BASE_URL}/api/v1/health`)
  return response.data
}


//Internal: create a temporary <a> to force browser file download 
function _triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.replace(/\s+/g, '_')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
