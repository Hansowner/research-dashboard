import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from './ui/button'
import { searchAcrossAllLevels, getMatchPreview, type SearchResult } from '../utils/search'
import type { Theme, Cluster, Entity } from '../types'

interface SearchBarProps {
  themes: Theme[]
  onResultClick: (result: SearchResult) => void
}

export default function SearchBar({ themes, onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        const searchResults = searchAcrossAllLevels(themes, query)
        setResults(searchResults)
        setSelectedIndex(0)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, themes])

  // Reset selectedIndex if it's out of bounds when results change
  useEffect(() => {
    if (selectedIndex >= results.length && results.length > 0) {
      setSelectedIndex(0)
    }
  }, [results.length, selectedIndex])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length)
        break
      case 'Enter':
        e.preventDefault()
        if (results[selectedIndex]) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        handleClose()
        break
    }
  }, [isOpen, results, selectedIndex])

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result)
    handleClose()
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
    setResults([])
    setSelectedIndex(0)
  }

  const handleFocus = () => {
    setIsOpen(true)
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'theme':
        return '📁'
      case 'cluster':
        return '📂'
      case 'entity':
        return '📄'
      default:
        return '•'
    }
  }

  const getResultTitle = (result: SearchResult): string => {
    switch (result.type) {
      case 'theme':
        return (result.item as Theme).title
      case 'cluster':
        return (result.item as Cluster).name
      case 'entity':
        return (result.item as Entity).statement
      default:
        return ''
    }
  }

  const getResultDescription = (result: SearchResult): string => {
    switch (result.type) {
      case 'theme':
        return (result.item as Theme).description
      case 'cluster':
        return (result.item as Cluster).summary
      case 'entity':
        return (result.item as Entity).verbatimQuote
      default:
        return ''
    }
  }

  const getBreadcrumb = (result: SearchResult): string => {
    const parts: string[] = []
    if (result.theme) parts.push(result.theme.title)
    if (result.cluster && result.type !== 'cluster') parts.push(result.cluster.name)
    return parts.join(' › ')
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Search themes, clusters, entities..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search research data"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClose}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
        >
          {results.length > 0 ? (
            <>
              <div className="p-2 border-b text-xs text-gray-500 sticky top-0 bg-white">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </div>
              <div className="py-1">
                {results.map((result, idx) => {
                  const title = getResultTitle(result)
                  const description = getResultDescription(result)
                  const breadcrumb = getBreadcrumb(result)

                  return (
                    <button
                      key={`${result.type}-${(result.item as any).id}-${idx}`}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                        idx === selectedIndex ? 'bg-blue-50' : ''
                      }`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0 mt-0.5">
                          {getResultIcon(result.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500 uppercase">
                              {result.type}
                            </span>
                            {breadcrumb && (
                              <span className="text-xs text-gray-400">
                                {breadcrumb}
                              </span>
                            )}
                          </div>
                          <div className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {title}
                          </div>
                          {description && (
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {getMatchPreview(
                                description,
                                result.matches?.find((m) => m.key.includes('description') || m.key.includes('summary') || m.key.includes('quote'))?.indices
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
