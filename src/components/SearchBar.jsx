import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query, 300)

  useEffect(() => {
    try {
      const regex = new RegExp(debouncedQuery, 'i')
      onSearch(regex)
    } catch {
      // Handle invalid regex patterns
      onSearch(new RegExp('.*', 'i'))
    }
  }, [debouncedQuery, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Search products (regex enabled)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-4 bg-slate-800 border-slate-700"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-3 text-slate-400 hover:text-danger"
        >
          ×
        </button>
      )}
    </div>
  )
}