import { useState, useEffect } from 'react'
import { useProducts } from '../../context/ProductContext'

export default function Filters() {
  const { refreshProducts } = useProducts()
  const [showExpiring, setShowExpiring] = useState(false)
  
  // Covert operation to detect expiring products
  useEffect(() => {
    if (showExpiring) {
      refreshProducts()
    }
  }, [showExpiring, refreshProducts])

  return (
    <div className="flex items-center gap-6 bg-slate-800 p-4 rounded-lg">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="expiring"
          checked={showExpiring}
          onChange={(e) => setShowExpiring(e.target.checked)}
          className="w-4 h-4 accent-primary-500"
        />
        <label htmlFor="expiring" className="text-sm">
          Show products expiring within 7 days
        </label>
      </div>
    </div>
  )
}