import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm/ProductForm'
import { productAPI } from '../services/api'
import { toast } from 'sonner'

export default function AddProductPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      await productAPI.create(formData)
      toast.success('Product added to inventory')
      navigate('/')
    } catch (error) {
      toast.error(`Failed to add product: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Product</h2>
      <ProductForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}