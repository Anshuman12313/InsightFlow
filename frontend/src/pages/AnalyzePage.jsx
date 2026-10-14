import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../components/common/StepIndicator'
import ColumnSelector from '../components/columns/ColumnSelector'
import ProcessingSteps from '../components/processing/ProcessingSteps'
import FileUpload from '../components/upload/FileUpload'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { analyzeData, getErrorMessage, uploadCsv } from '../services/api'
import { parseCsvPreview } from '../utils/csv'
import { saveResults } from '../utils/storage'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadInfo, setUploadInfo] = useState(null)
  const [previewRows, setPreviewRows] = useState([])
  const [feedbackColumn, setFeedbackColumn] = useState('')
  const [metadataColumns, setMetadataColumns] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAnalyzing) {
      return undefined
    }

    const interval = setInterval(() => {
      setProcessingStep((current) => (current < 4 ? current + 1 : current))
    }, 4000)

    return () => clearInterval(interval)
  }, [isAnalyzing])

  async function handleFileSelected(file) {
    setSelectedFile(file)
    setUploadInfo(null)
    setFeedbackColumn('')
    setMetadataColumns([])
    setError('')

    try {
      const preview = await parseCsvPreview(file)
      setPreviewRows(preview.rows)
    } catch (previewError) {
      setPreviewRows([])
      setError(previewError.message)
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError('Please choose a CSV file first.')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError('')

    try {
      const response = await uploadCsv(selectedFile, (event) => {
        if (event.total) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100))
        }
      })

      setUploadInfo(response)
      setPreviewRows(response.preview || previewRows)
      setStep(2)
    } catch (uploadError) {
      setError(getErrorMessage(uploadError))
    } finally {
      setIsUploading(false)
    }
  }

  function handleFeedbackColumnChange(column) {
    setFeedbackColumn(column)
    setMetadataColumns((current) => {
      const cleaned = current.filter((item) => item !== feedbackColumn)
      if (column) {
        return Array.from(new Set([...cleaned, column]))
      }
      return cleaned
    })
  }

  function handleMetadataToggle(column) {
    setMetadataColumns((current) => {
      if (current.includes(column)) {
        const next = current.filter((item) => item !== column)
        if (feedbackColumn && !next.includes(feedbackColumn)) {
          return [...next, feedbackColumn]
        }
        return next
      }

      return [...current, column]
    })
  }

  async function handleAnalyze() {
    if (!uploadInfo?.filename) {
      setError('Upload a CSV file before analyzing.')
      return
    }

    if (!feedbackColumn) {
      setError('Please select a feedback column.')
      return
    }

    const usefulColumns = Array.from(new Set([...metadataColumns, feedbackColumn]))

    setStep(3)
    setIsAnalyzing(true)
    setProcessingStep(0)
    setError('')

    try {
      const results = await analyzeData({
        usefulColumns,
        feedbackColumn,
        fileName: uploadInfo.filename,
      })

      saveResults(results)
      setStep(4)
      navigate('/results')
    } catch (analyzeError) {
      setStep(2)
      setError(getErrorMessage(analyzeError))
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Analyze feedback CSV</h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload your data, choose columns, and run the clustering pipeline.
        </p>
      </div>

      <StepIndicator currentStep={step} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      {step === 1 && (
        <Card title="Upload CSV" description="Accepted format: .csv">
          <FileUpload
            onFileSelected={handleFileSelected}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />

          <div className="mt-6 flex justify-end">
            <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload and Continue'}
            </Button>
          </div>
        </Card>
      )}

      {step >= 2 && uploadInfo && (
        <Card
          title="Column selection"
          description={`${uploadInfo.filename} • ${uploadInfo.row_count ?? '—'} rows detected`}
        >
          <ColumnSelector
            columns={uploadInfo.columns}
            feedbackColumn={feedbackColumn}
            metadataColumns={metadataColumns}
            previewRows={previewRows}
            onFeedbackColumnChange={handleFeedbackColumnChange}
            onMetadataToggle={handleMetadataToggle}
          />

          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back to upload
            </Button>
            <Button onClick={handleAnalyze} disabled={!feedbackColumn || isAnalyzing}>
              Start analysis
            </Button>
          </div>
        </Card>
      )}

      {step === 3 && isAnalyzing && (
        <Card title="Processing data">
          <ProcessingSteps activeStep={processingStep} />
        </Card>
      )}
    </div>
  )
}
