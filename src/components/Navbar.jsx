import { Link } from 'react-router-dom'
import { PackagePlus, PackageSearch } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-slate-800 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold text-primary-500"
        >
          <PackageSearch className="w-6 h-6" />
          <span>StockWise</span>
        </Link>
        <Link
          to="/add"
          className="btn flex items-center gap-1"
        >
          <PackagePlus className="w-4 h-4" />
          Add Product
        </Link>
      </div>
    </nav>
  )
}