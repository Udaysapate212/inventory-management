import { useState } from 'react'
import { useProducts } from '../../context/ProductContext'
import { ArrowUpDown, AlertTriangle } from 'lucide-react'
import { format, differenceInDays, parseISO } from 'date-fns'
import DeleteModal from '../../components/DeleteModal'
import ImagePlaceholder from '../../components/ImagePlaceholder'

export default function ProductTable({ products }) {
  const [sortConfig, setSortConfig] = useState({ key: 'expDate', direction: 'asc' })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { deleteProduct } = useProducts()

  // Special Ops sorting algorithm
  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.key === 'expDate') {
      const dateA = parseISO(a.expDate)
      const dateB = parseISO(b.expDate)
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
    }
    return 0
  })

  // Threat level assessment (expiry date)
  const getExpiryStatus = (expDate) => {
    const daysRemaining = differenceInDays(parseISO(expDate), new Date())
    if (daysRemaining < 0) return 'expired'
    if (daysRemaining <= 7) return 'critical'
    return 'safe'
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-6 py-4 text-left">Product</th>
            <th 
              className="px-6 py-4 text-left cursor-pointer hover:bg-slate-700"
              onClick={() => setSortConfig(prev => ({
                key: 'expDate',
                direction: prev.direction === 'asc' ? 'desc' : 'asc'
              }))}
            >
              <div className="flex items-center gap-2">
                Expiry Date
                <ArrowUpDown className="w-4 h-4" />
                {sortConfig.direction === 'asc' ? '↑' : '↓'}
              </div>
            </th>
            <th className="px-6 py-4 text-left">Quantity</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(product => {
            const status = getExpiryStatus(product.expDate)
            const isCritical = status === 'critical' || status === 'expired'

            return (
              <tr 
                key={product.id}
                className="border-t border-slate-700 hover:bg-slate-800/50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {product.imgUrl ? (
                      <img 
                        src={product.imgUrl} 
                        alt={product.name}
                        className="w-12 h-12 rounded object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          if (e.target.nextElementSibling) {
  e.target.nextElementSibling.style.display = 'block'
}
                        }}
                      />
                    ) : <ImagePlaceholder />}
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {format(parseISO(product.expDate), 'PP')}
                    {isCritical && (
                      <AlertTriangle 
                        className="w-4 h-4 text-danger animate-pulse" 
                        aria-label="Critical alert"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4">
                  <span className={`badge-${status} px-2 py-1 rounded-full text-xs font-bold`}>
                    {status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button 
                    className="text-primary-500 hover:text-primary-400"
                    onClick={() => window.location = `/edit/${product.id}`}
                  >
                    Edit
                  </button>
                  <button
                    className="text-danger hover:text-red-400"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <DeleteModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={() => {
          deleteProduct(selectedProduct.id)
          setSelectedProduct(null)
        }}
      />
    </div>
  )
}