import { Document, Page } from '@react-pdf/renderer'
import { styles } from './pdfStyles'
import PDFTitlePage from './PDFTitlePage'
import PDFHeader from './PDFHeader'
import PDFFooter from './PDFFooter'
import PDFThemeSection from './PDFThemeSection'
import type { Theme } from '../../types'

interface PDFDocumentProps {
  themes: Theme[]
  exportDate: string
}

export default function PDFDocument({ themes, exportDate }: PDFDocumentProps) {
  // Calculate statistics
  const themeCount = themes.length
  const clusterCount = themes.reduce((sum, theme) => sum + theme.clusters.length, 0)
  const entityCount = themes.reduce(
    (sum, theme) =>
      sum + theme.clusters.reduce((clusterSum, cluster) => clusterSum + cluster.entities.length, 0),
    0
  )

  return (
    <Document
      title="Research Synthesis Report"
      author="Research Synthesis Dashboard"
      subject="Strategic insights from user research"
      keywords="research, synthesis, user insights, themes, clusters, entities"
      creator="Research Synthesis Dashboard"
      producer="@react-pdf/renderer"
    >
      {/* Title Page */}
      <PDFTitlePage
        themeCount={themeCount}
        clusterCount={clusterCount}
        entityCount={entityCount}
        exportDate={exportDate}
      />

      {/* Content Pages - Each theme on its own page to prevent coordinate overflow */}
      {themes.map((theme, themeIdx) => (
        <Page key={theme.id} size="A4" style={styles.page} wrap>
          <PDFHeader />
          <PDFThemeSection theme={theme} themeNumber={themeIdx + 1} />
          <PDFFooter exportDate={exportDate} />
        </Page>
      ))}
    </Document>
  )
}
