import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm/ProductForm'
import { productAPI } from '../services/api'
import { toast } from 'sonner'
import { Skeleton } from '../components/ui/skeleton'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data } = await productAPI.fetchById(id)
        setProduct(data)
      } catch (error) {
        toast.error('Failed to load product')
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }
    loadProduct()
  }, [id, navigate])

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      await productAPI.update(id, formData)
      toast.success('Product updated successfully')
      navigate('/')
    } catch (error) {
      toast.error(`Update failed: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-slate-800" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full bg-slate-800" />
          <Skeleton className="h-10 w-full bg-slate-800" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-10 bg-slate-800" />
            <Skeleton className="h-10 bg-slate-800" />
          </div>
          <Skeleton className="h-10 w-full bg-slate-800" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Edit Product</h2>
      <ProductForm 
        initialProduct={product}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}