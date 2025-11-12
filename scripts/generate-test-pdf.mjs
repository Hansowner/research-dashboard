import { renderToBuffer } from '@react-pdf/renderer'
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import React from 'react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Make React available globally for components that don't import it
globalThis.React = React

// Import PDF components dynamically
async function generatePDF() {
  console.log('📄 Starting PDF generation...')

  try {
    // Load research data - using user's actual 8-theme dataset
    const dataPath = join(projectRoot, 'research-insights-dashboard.json')
    const dataContent = await readFile(dataPath, 'utf-8')
    const data = JSON.parse(dataContent)

    console.log(`✓ Loaded ${data.themes.length} themes from research data`)
    console.log(`✓ Total entities: ${data.themes.reduce((sum, t) => sum + t.clusters.reduce((cSum, c) => cSum + c.entities.length, 0), 0)}`)

    // We need to use dynamic import for ESM modules
    const { default: PDFDocument } = await import('../src/components/pdf/PDFDocument.tsx')

    // Format export date
    const exportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    console.log('✓ Creating PDF document...')

    // Create PDF document
    const doc = React.createElement(PDFDocument, {
      themes: data.themes,
      exportDate: exportDate
    })

    // Render to buffer
    console.log('✓ Rendering PDF to buffer...')
    const pdfBuffer = await renderToBuffer(doc)

    // Save to file
    const outputPath = join(projectRoot, 'test-output/test-report.pdf')
    await writeFile(outputPath, pdfBuffer)

    console.log(`✅ PDF generated successfully!`)
    console.log(`📁 Output: ${outputPath}`)
    console.log(`📊 File size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`)

  } catch (error) {
    console.error('❌ Error generating PDF:', error)
    process.exit(1)
  }
}

generatePDF()
