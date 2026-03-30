import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, FileText, CheckCircle2, FileUp, ClipboardType, Loader2, X } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import Button from './ui/Button'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import mammoth from 'mammoth'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

async function extractTextFromFile(file) {
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return await file.text()
  }

  if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    const pages = await Promise.all(
      Array.from({ length: pdf.numPages }, (_, i) =>
        pdf.getPage(i + 1).then((page) => page.getTextContent())
      )
    )
    return pages
      .flatMap((page) => page.items.map((item) => item.str))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value.trim()
  }

  throw new Error('Unsupported file type')
}

function ResumeUpload({ onFileSelect, jobDescription, onJobDescriptionChange }) {
  const [selectedFileName, setSelectedFileName] = useState(null)
  const [jdTab, setJdTab] = useState('paste') // 'paste' | 'upload'
  const [jdFileName, setJdFileName] = useState(null)
  const [jdParsing, setJdParsing] = useState(false)
  const [jdParseError, setJdParseError] = useState(null)
  const [uploadError, setUploadError] = useState(null)

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      setSelectedFileName(file.name)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const onDropRejected = useCallback((fileRejections) => {
    const error = fileRejections[0]?.errors[0]
    if (error?.code === 'file-too-large') {
      setUploadError('File is too large. Max size is 5MB.')
    } else if (error?.code === 'file-invalid-type') {
      setUploadError('Invalid file format. Please upload PDF or DOCX.')
    } else {
      setUploadError('File upload failed.')
    }
    setTimeout(() => setUploadError(null), 5000)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  })

  const onJdDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return
      const file = acceptedFiles[0]
      setJdFileName(file.name)
      setJdParseError(null)
      setJdParsing(true)
      try {
        const text = await extractTextFromFile(file)
        if (!text || text.trim() === '') {
          setJdParseError('The uploaded job description file appears to be empty.')
          return
        }
        onJobDescriptionChange(text)
        setJdTab('paste') // switch to paste tab to show extracted text
      } catch (err) {
        setJdParseError('Could not parse the file. Please paste the text manually.')
      } finally {
        setJdParsing(false)
      }
    },
    [onJobDescriptionChange]
  )

  const onJdDropRejected = useCallback((fileRejections) => {
    const error = fileRejections[0]?.errors[0]
    if (error?.code === 'file-too-large') {
      setJdParseError('File is too large. Max size is 5MB.')
    } else if (error?.code === 'file-invalid-type') {
      setJdParseError('Invalid file format. Please upload PDF, DOCX, or TXT.')
    } else {
      setJdParseError('File upload failed.')
    }
  }, [])

  const {
    getRootProps: getJdRootProps,
    getInputProps: getJdInputProps,
    isDragActive: isJdDragActive,
  } = useDropzone({
    onDrop: onJdDrop,
    onDropRejected: onJdDropRejected,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
    disabled: jdParsing,
  })

  const clearJdFile = () => {
    setJdFileName(null)
    setJdParseError(null)
    onJobDescriptionChange('')
  }

  return (
    <Card className="p-8 md:p-10 space-y-10">

      {/* ---- Section: Resume Upload ---- */}
      <div className="animate-fade-in-up">
        <label className="flex items-center gap-2 text-lg font-bold text-secondary-900 mb-4">
          <FileUp className="w-5 h-5 text-primary-500" /> Upload Your Resume
        </label>

        <div
          {...getRootProps()}
          className={`
            relative group border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragActive
              ? 'border-primary-500 bg-primary-50/50'
              : 'border-secondary-200 bg-secondary-50/50 hover:border-primary-400 hover:bg-surface'
            }
          `}
        >
          <input {...getInputProps()} />

          {isDragActive ? (
            <div className="flex flex-col items-center justify-center space-y-3">
              <UploadCloud className="w-12 h-12 text-primary-500 animate-bounce" />
              <p className="text-primary-600 font-semibold text-lg">Drop it like it's hot!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary-100">
                <UploadCloud className="w-8 h-8 text-primary-500" />
              </div>
              <div>
                <p className="text-secondary-700 font-semibold text-lg">Drag & drop your resume here</p>
                <p className="text-secondary-500 mt-1">
                  or <span className="text-primary-600 font-medium group-hover:underline">click to browse</span>
                </p>
              </div>
              <p className="text-secondary-400 text-xs mt-2 bg-surface px-3 py-1 rounded-full border border-secondary-100 shadow-sm inline-block">
                Supported: PDF, DOCX (Max: 5MB)
              </p>
            </div>
          )}
        </div>

        {uploadError && (
          <p className="mt-3 text-sm text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 animate-fade-in">
            {uploadError}
          </p>
        )}

        {selectedFileName && !uploadError && (
          <div className="mt-4 flex items-center gap-3 bg-emerald-50 border border-emerald-100/50 rounded-xl px-5 py-4 transition-all animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="text-sm font-semibold text-emerald-900 truncate">{selectedFileName}</span>
            <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded ml-auto shrink-0">Ready for analysis</span>
          </div>
        )}
      </div>

      <hr className="border-secondary-100" />

      {/* ---- Section: Job Description ---- */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <label className="flex items-center gap-2 text-lg font-bold text-secondary-900">
            <FileText className="w-5 h-5 text-primary-500" /> Job Description
            <span className="text-xs font-semibold bg-primary-50 text-primary-600 px-2 py-0.5 rounded uppercase tracking-wider ml-2">Optional</span>
          </label>
        </div>

        <p className="text-sm text-secondary-500 mb-4 leading-relaxed">
          Paste the job posting or upload a PDF/DOCX to get a targeted keyword match analysis.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-secondary-100 rounded-xl mb-4 w-fit">
          <button
            type="button"
            onClick={() => setJdTab('paste')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${jdTab === 'paste'
              ? 'bg-surface text-secondary-800 shadow-sm'
              : 'text-secondary-500 hover:text-secondary-700'
              }`}
          >
            <ClipboardType className="w-4 h-4" />
            Paste Text
          </button>
          <button
            type="button"
            onClick={() => setJdTab('upload')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${jdTab === 'upload'
              ? 'bg-surface text-secondary-800 shadow-sm'
              : 'text-secondary-500 hover:text-secondary-700'
              }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload File
          </button>
        </div>

        {/* Paste Text Tab */}
        {jdTab === 'paste' && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-500 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-500"></div>
            <textarea
              value={jobDescription}
              onChange={(event) => onJobDescriptionChange(event.target.value)}
              placeholder="Paste the job description here...&#10;&#10;Example: We are looking for a Senior Product Designer with experience in Figma, Design Systems, and React..."
              rows={6}
              className="relative w-full bg-background border border-secondary-200 rounded-xl p-5 text-sm text-secondary-700 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-surface resize-y transition-all shadow-sm"
            />
          </div>
        )}

        {/* Upload File Tab */}
        {jdTab === 'upload' && (
          <div>
            {jdFileName && !jdParsing ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100/50 rounded-xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="text-sm font-semibold text-emerald-900 truncate">{jdFileName}</span>
                <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded ml-auto shrink-0">Text extracted</span>
                <button
                  type="button"
                  onClick={clearJdFile}
                  className="ml-1 p-1 rounded-full hover:bg-emerald-100 transition-colors shrink-0"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            ) : (
              <div
                {...getJdRootProps()}
                className={`
                  relative group border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${jdParsing ? 'opacity-60 cursor-not-allowed border-secondary-200 bg-secondary-50/50' :
                    isJdDragActive
                      ? 'border-primary-500 bg-primary-50/50'
                      : 'border-secondary-200 bg-secondary-50/50 hover:border-primary-400 hover:bg-secondary-50'
                  }
                `}
              >
                <input {...getJdInputProps()} />

                {jdParsing ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    <p className="text-secondary-600 font-medium">Extracting text from file...</p>
                  </div>
                ) : isJdDragActive ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <UploadCloud className="w-10 h-10 text-primary-500 animate-bounce" />
                    <p className="text-primary-600 font-semibold">Drop to extract text!</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-primary-100">
                      <FileText className="w-7 h-7 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-secondary-700 font-semibold">Drag & drop your job description</p>
                      <p className="text-secondary-500 mt-1 text-sm">
                        or <span className="text-primary-600 font-medium group-hover:underline">click to browse</span>
                      </p>
                    </div>
                    <p className="text-secondary-400 text-xs bg-surface px-3 py-1 rounded-full border border-secondary-100 shadow-sm inline-block">
                      Supported: PDF, DOCX, TXT
                    </p>
                  </div>
                )}
              </div>
            )}

            {jdParseError && (
              <p className="mt-3 text-sm text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">
                {jdParseError}
              </p>
            )}
          </div>
        )}

        {jobDescription.length > 0 && (
          <p className="text-xs font-medium text-secondary-400 mt-2 text-right">
            {jobDescription.length} characters
          </p>
        )}
      </div>

    </Card>
  )
}

export default ResumeUpload
