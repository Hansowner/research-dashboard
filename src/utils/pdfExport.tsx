import { pdf } from '@react-pdf/renderer'
import PDFDocument from '../components/pdf/PDFDocument'
import type { Theme } from '../types'

/**
 * Validates and sanitizes theme data before PDF generation
 * Ensures all required fields have valid values
 */
function sanitizeThemeData(themes: Theme[]): Theme[] {
  return themes.map(theme => ({
    ...theme,
    title: theme.title || 'Untitled Theme',
    description: theme.description || '',
    sources: Array.isArray(theme.sources) ? theme.sources : [],
    clusters: (theme.clusters || []).map(cluster => ({
      ...cluster,
      name: cluster.name || 'Untitled Cluster',
      summary: cluster.summary || '',
      entities: (cluster.entities || []).map(entity => ({
        ...entity,
        statement: entity.statement || '',
        pains: Array.isArray(entity.pains) ? entity.pains : [],
        gains: Array.isArray(entity.gains) ? entity.gains : [],
        source: entity.source || '',
        transcriptId: entity.transcriptId || '',
        participantId: entity.participantId || '',
        date: entity.date || '',
        timestamp: entity.timestamp || '',
        verbatimQuote: entity.verbatimQuote || '',
        context: entity.context || ''
      }))
    }))
  }))
}

export async function generateAndDownloadPDF(themes: Theme[]): Promise<void> {
  try {
    // Validate input
    if (!themes || themes.length === 0) {
      throw new Error('No themes data provided for PDF generation')
    }

    // Sanitize data to ensure all required fields exist
    const sanitizedThemes = sanitizeThemeData(themes)

    console.log('[PDF Export] Starting PDF generation with', sanitizedThemes.length, 'themes')

    // Format export date
    const exportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    // Generate filename
    const filename = `research-synthesis-report-${new Date().toISOString().split('T')[0]}.pdf`

    // Generate PDF blob
    console.log('[PDF Export] Rendering PDF document...')
    const blob = await pdf(<PDFDocument themes={sanitizedThemes} exportDate={exportDate} />).toBlob()
    console.log('[PDF Export] PDF rendered successfully, size:', (blob.size / 1024).toFixed(2), 'KB')

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('[PDF Export] PDF downloaded successfully:', filename)
  } catch (error) {
    console.error('[PDF Export] Failed to generate PDF:', error)

    // Re-throw with additional context
    if (error instanceof Error) {
      throw new Error(`PDF Generation Failed: ${error.message}`)
    }
    throw new Error('PDF Generation Failed: Unknown error occurred')
  }
}
