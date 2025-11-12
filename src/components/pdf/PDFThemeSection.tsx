import { Text, View } from '@react-pdf/renderer'
import { styles, pdfThemeColors } from './pdfStyles'
import PDFClusterSection from './PDFClusterSection'
import type { Theme } from '../../types'

interface PDFThemeSectionProps {
  theme: Theme
  themeNumber: number
}

export default function PDFThemeSection({ theme, themeNumber }: PDFThemeSectionProps) {
  const colorScheme = pdfThemeColors[theme.color] || pdfThemeColors.blue

  // Defensive checks
  if (!theme) return null
  const title = theme.title || 'Untitled Theme'
  const description = theme.description || ''
  const sources = Array.isArray(theme.sources) ? theme.sources : []
  const clusters = Array.isArray(theme.clusters) ? theme.clusters : []

  return (
    <View style={styles.themeSection}>
      {/* Color accent bar */}
      <View style={[styles.themeAccentBar, { backgroundColor: colorScheme.accent }]} />

      {/* Theme header */}
      <View style={styles.themeHeader}>
        <Text style={styles.themeTitle} hyphenationCallback={word => [word]}>
          {themeNumber}. {title}
        </Text>

        <Text style={styles.themeDescription}>{description}</Text>

        {/* Source badges */}
        <View style={styles.badgeContainer}>
          {sources.map((source, idx) => (
            <View
              key={idx}
              style={[
                styles.badge,
                {
                  backgroundColor: colorScheme.background,
                  color: colorScheme.text
                }
              ]}
            >
              <Text>{source}</Text>
            </View>
          ))}
        </View>

        {/* Theme metadata */}
        <View style={styles.themeMetadata}>
          <Text style={styles.themeMetaText}>
            {clusters.length} {clusters.length === 1 ? 'cluster' : 'clusters'}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.sectionDivider} />

      {/* Clusters */}
      {clusters.map((cluster, idx) => (
        <PDFClusterSection
          key={cluster.id || `cluster-${idx}`}
          cluster={cluster}
          clusterNumber={idx + 1}
        />
      ))}
    </View>
  )
}
