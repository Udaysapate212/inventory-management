import { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Loader2, ImageIcon, ScanEye } from 'lucide-react'

export default function ImageUpload({ 
  previewUrl, 
  onFileChange, 
  isProcessing 
}) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) {
      onFileChange(acceptedFiles[0])
    }
  }, [onFileChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false,
    disabled: isProcessing
  })

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
        ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-slate-700'}
        ${isProcessing && 'opacity-50 cursor-wait'}`}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary-500" />
            <p className="text-sm text-slate-400">
              Analyzing product label with AI...
            </p>
          </>
        ) : previewUrl ? (
          <>
            <div className="relative group">
              <img
                src={previewUrl}
                alt="Preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ScanEye className="text-white w-8 h-8" />
              </div>
            </div>
            <p className="text-sm text-slate-400">Click to change image</p>
          </>
        ) : (
          <>
            <ImageIcon className="w-12 h-12 mx-auto text-slate-600" />
            <p className="text-sm text-slate-400">
              {isDragActive 
                ? 'Drop product label here' 
                : 'Drag image or click to upload'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}