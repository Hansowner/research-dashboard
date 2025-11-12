import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { validateJSON } from '../utils/jsonValidator'
import { generateAndDownloadPDF } from '../utils/pdfExport'
import type { Theme } from '../types'

interface DataState {
  themes: Theme[]
}

interface PersistenceOptions {
  autoSaveToLocalStorage?: boolean
  localStorageKey?: string
}

export function useDataPersistence(options: PersistenceOptions = {}) {
  const {
    autoSaveToLocalStorage = true,
    localStorageKey = 'research-dashboard-data'
  } = options

  const [data, setData] = useState<DataState>({ themes: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const fileHandleRef = useRef<FileSystemFileHandle | null>(null)
  const isInitialLoadRef = useRef(true)

  // Load data on mount - localStorage first, then fallback to JSON
  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        // Try localStorage first
        const savedData = localStorage.getItem(localStorageKey)
        if (savedData) {
          const parsed = JSON.parse(savedData)
          if (!cancelled) {
            setData(parsed)
            setLastSaved(new Date(localStorage.getItem(`${localStorageKey}-timestamp`) || Date.now()))
            toast.success('Data loaded from local storage')
          }
        } else {
          // Fallback to default JSON file
          const module = await import('../data/research-data.json')
          if (!cancelled) {
            setData(module.default as DataState)
            toast.info('Loaded default research data')
          }
        }
      } catch (err) {
        console.error('Error loading data:', err)
        if (!cancelled) {
          toast.error('Failed to load data')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          isInitialLoadRef.current = false
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [localStorageKey])

  // Auto-save to localStorage whenever data changes (with debouncing)
  useEffect(() => {
    // Skip initial load
    if (isInitialLoadRef.current) return

    // Debounce auto-save to avoid excessive writes
    const timeoutId = setTimeout(() => {
      if (autoSaveToLocalStorage && data.themes.length > 0) {
        try {
          localStorage.setItem(localStorageKey, JSON.stringify(data))
          localStorage.setItem(`${localStorageKey}-timestamp`, new Date().toISOString())
          setLastSaved(new Date())
        } catch (err: any) {
          console.error('Error saving to localStorage:', err)
          if (err.name === 'QuotaExceededError') {
            toast.error('Storage quota exceeded. Please export your data to a file instead.')
          } else {
            toast.error('Failed to auto-save data')
          }
        }
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [data, autoSaveToLocalStorage, localStorageKey])

  // Save to File System API
  const saveToFile = useCallback(async () => {
    try {
      let fileHandle = fileHandleRef.current

      // If we don't have a file handle, prompt user to select/create a file
      if (!fileHandle) {
        // Check if File System Access API is supported
        if (!('showSaveFilePicker' in window)) {
          toast.error('File System API not supported in this browser')
          return
        }

        fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: 'research-data.json',
          types: [
            {
              description: 'JSON Files',
              accept: { 'application/json': ['.json'] }
            }
          ]
        })

        fileHandleRef.current = fileHandle
      }

      // Write data to file (fileHandle is guaranteed to exist here)
      if (!fileHandle) {
        toast.error('Failed to get file handle')
        return
      }

      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(data, null, 2))
      await writable.close()

      setLastSaved(new Date())
      toast.success('Data saved to file successfully')
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error saving to file:', err)
        toast.error('Failed to save to file')
      }
    }
  }, [data])

  // Load from File System API
  const loadFromFile = useCallback(async () => {
    try {
      // Check if File System Access API is supported
      if (!('showOpenFilePicker' in window)) {
        toast.error('File System API not supported in this browser')
        return
      }

      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }
        ]
      })

      const file = await fileHandle.getFile()
      const contents = await file.text()

      // Validate JSON structure
      const validationResult = validateJSON(contents)

      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.slice(0, 3).map(e => e.message).join('; ')
        toast.error(`Invalid data format: ${errorMessages}${validationResult.errors.length > 3 ? '...' : ''}`)
        return
      }

      // Show warnings if any
      if (validationResult.warnings.length > 0) {
        toast.warning(`Loaded with ${validationResult.warnings.length} warning(s). Data may have inconsistencies.`)
      }

      const parsed = JSON.parse(contents)
      setData(parsed)
      fileHandleRef.current = fileHandle
      setLastSaved(new Date())
      toast.success('Data loaded from file successfully')
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error loading from file:', err)
        toast.error('Failed to load from file')
      }
    }
  }, [])

  // Export as JSON (download)
  const exportToJSON = useCallback(() => {
    try {
      const jsonStr = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `research-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Data exported successfully')
    } catch (err) {
      console.error('Error exporting data:', err)
      toast.error('Failed to export data')
    }
  }, [data])

  // Import from JSON (file upload)
  const importFromJSON = useCallback((file: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const contents = e.target?.result as string

        // Validate JSON structure
        const validationResult = validateJSON(contents)

        if (!validationResult.isValid) {
          const errorMessages = validationResult.errors.slice(0, 3).map(e => e.message).join('; ')
          toast.error(`Invalid data format: ${errorMessages}${validationResult.errors.length > 3 ? '...' : ''}`)
          return
        }

        // Show warnings if any
        if (validationResult.warnings.length > 0) {
          toast.warning(`Imported with ${validationResult.warnings.length} warning(s). Data may have inconsistencies.`)
        }

        const parsed = JSON.parse(contents)
        setData(parsed)
        setLastSaved(new Date())
        toast.success('Data imported successfully')
      } catch (err) {
        console.error('Error importing data:', err)
        toast.error('Failed to import data - ' + (err as Error).message)
      }
    }

    reader.onerror = () => {
      toast.error('Failed to read file')
    }

    reader.readAsText(file)
  }, [])

  // Clear localStorage and reset to default
  const resetToDefault = useCallback(async () => {
    try {
      const module = await import('../data/research-data.json')
      setData(module.default as DataState)
      localStorage.removeItem(localStorageKey)
      localStorage.removeItem(`${localStorageKey}-timestamp`)
      fileHandleRef.current = null
      setLastSaved(null)
      toast.success('Reset to default data')
    } catch (err) {
      console.error('Error resetting data:', err)
      toast.error('Failed to reset data')
    }
  }, [localStorageKey])

  // Export as PDF with timeout protection
  const exportToPDF = useCallback(async () => {
    const toastId = toast.loading('Generating PDF report...')

    try {
      // Add timeout protection (30 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('PDF generation timed out after 30 seconds')), 30000)
      })

      const pdfPromise = generateAndDownloadPDF(data.themes)

      await Promise.race([pdfPromise, timeoutPromise])

      toast.dismiss(toastId)
      toast.success('PDF report downloaded successfully')
    } catch (err) {
      console.error('Error generating PDF:', err)
      toast.dismiss(toastId)

      // Provide more helpful error messages
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'

      if (errorMessage.includes('timeout')) {
        toast.error('PDF generation timed out. Try with a smaller dataset or contact support.')
      } else if (errorMessage.includes('Failed')) {
        toast.error(`${errorMessage}. Check browser console for details.`)
      } else {
        toast.error('Failed to generate PDF report. Check your data format.')
      }
    }
  }, [data.themes])

  return {
    data,
    setData,
    isLoading,
    lastSaved,
    saveToFile,
    loadFromFile,
    exportToJSON,
    importFromJSON,
    resetToDefault,
    exportToPDF
  }
}
