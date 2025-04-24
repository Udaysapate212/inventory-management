import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="bg-slate-800 p-6 rounded-lg max-w-md text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-danger mb-4" />
        <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="mb-4 text-slate-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn inline-block"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}