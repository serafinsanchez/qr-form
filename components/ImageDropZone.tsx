"use client"

import { useCallback, useRef, useState } from 'react'
import { Image as ImageIcon, UploadCloud } from 'lucide-react'

interface ImageDropZoneProps {
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
  accept?: string
}

export default function ImageDropZone({ label, file, onFileChange, accept = 'image/*' }: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const f = files[0]
    if (!f.type.startsWith('image/')) return
    onFileChange(f)
  }, [onFileChange])

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <div
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors duration-200 bg-white/60 ${isDragging ? 'border-primary-400 bg-primary-50' : 'border-cream-300 hover:border-primary-300'}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {!file ? (
          <div className="flex flex-col items-center gap-2 text-gray-600">
            <UploadCloud className="w-8 h-8 text-primary-500" />
            <span className="text-sm">Drag & drop an image here, or click to browse</span>
            <span className="text-xs text-gray-400">PNG, JPG up to ~10MB</span>
          </div>
        ) : (
          <div className="w-full flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {file.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFileChange(null) }}
              className="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Remove
            </button>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  )
}


