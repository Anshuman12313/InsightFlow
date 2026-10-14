import { useRef, useState } from 'react'
import { formatFileSize } from '../../utils/format'
import { isCsvFile } from '../../utils/csv'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

export default function FileUpload({ onFileSelected, isUploading, uploadProgress }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')

  function validateAndSelect(file) {
    if (!isCsvFile(file)) {
      setError('Please upload a valid CSV file.')
      setSelectedFile(null)
      return
    }

    if (file.size === 0) {
      setError('The selected file is empty.')
      setSelectedFile(null)
      return
    }

    setError('')
    setSelectedFile(file)
    onFileSelected(file)
  }

  function handleDrop(event) {
    event.preventDefault()
    setDragActive(false)

    const file = event.dataTransfer.files?.[0]
    if (file) {
      validateAndSelect(file)
    }
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0]
    if (file) {
      validateAndSelect(file)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50'
        }`}
      >
        <p className="text-base font-medium text-slate-900">Drag and drop your CSV file here</p>
        <p className="mt-2 text-sm text-slate-500">or choose a file from your computer</p>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleInputChange}
        />

        <Button
          className="mt-5"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          Choose CSV File
        </Button>
      </div>

      {selectedFile && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-sm font-medium text-slate-900">{selectedFile.name}</p>
          <p className="mt-1 text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
        </div>
      )}

      {isUploading && (
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <Alert type="error" message={error} onClose={() => setError('')} />
    </div>
  )
}
