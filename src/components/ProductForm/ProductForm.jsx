import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ProductSchema } from '../../utils/validation'
import ImageUpload from './ImageUpload'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

export default function ProductForm({ 
  initialProduct, 
  onSubmit, 
  isSubmitting 
}) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [processingImage, setProcessingImage] = useState(false)

  const { 
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialProduct || {
      name: '',
      quantity: 1,
      expDate: ''
    }
  })

  // Initialize preview for edit mode
  useEffect(() => {
    if (initialProduct?.imgUrl) {
      setPreviewUrl(initialProduct.imgUrl)
    }
  }, [initialProduct])

  // Simulate AI processing
  const handleImageChange = async (file) => {
    try {
      setProcessingImage(true)
      
      // Fake processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setValue('image', file)
      
      // Simulate OCR errors randomly
      if (Math.random() < 0.2) {
        throw new Error('AI processing failed - Try another image')
      }
    } catch (error) {
      setError('image', { message: error.message })
      setPreviewUrl('')
    } finally {
      setProcessingImage(false)
    }
  }

  // Form submission handler
  const handleFormSubmit = async (data) => {
    try {
      // Convert image to mock API URL
      const imgUrl = data.image 
        ? `https://fake-ai-processor.com/${Date.now()}.jpg` 
        : initialProduct?.imgUrl || ''

      await onSubmit({ ...data, imgUrl })
      if (!initialProduct) reset()
    } catch (error) {
      toast.error(`Submission failed: ${error.message}`)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <ImageUpload
        previewUrl={previewUrl}
        onFileChange={handleImageChange}
        isProcessing={processingImage}
      />
      {errors.image && (
        <p className="text-danger text-sm">{errors.image.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <input
          {...register('name')}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors.name 
              ? 'border-danger bg-danger/10' 
              : 'border-slate-700 bg-slate-800'
          } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          placeholder="Enter product name"
          autoComplete="off"
          autoFocus
        />
        {errors.name && (
          <p className="text-danger text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Quantity</label>
          <input
            type="number"
            {...register('quantity', { valueAsNumber: true })}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.quantity 
                ? 'border-danger bg-danger/10' 
                : 'border-slate-700 bg-slate-800'
            } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            min="1"
            step="1"
          />
          {errors.quantity && (
            <p className="text-danger text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Expiry Date</label>
          <input
            type="date"
            {...register('expDate')}
            className={`w-full px-4 py-2 rounded-lg border ${
              errors.expDate 
                ? 'border-danger bg-danger/10' 
                : 'border-slate-700 bg-slate-800'
            } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          {errors.expDate && (
            <p className="text-danger text-sm mt-1">{errors.expDate.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || processingImage}
        className={`w-full px-6 py-3 rounded-lg font-medium flex justify-center items-center gap-2 ${
          isSubmitting || processingImage
            ? 'bg-primary-600 cursor-not-allowed'
            : 'bg-primary-500 hover:bg-primary-600'
        } text-white transition-colors`}
      >
        {isSubmitting || processingImage ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : initialProduct ? (
          'Update Product'
        ) : (
          'Add Product'
        )}
      </button>
    </form>
  )
}