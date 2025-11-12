import { Text, View } from '@react-pdf/renderer'
import { styles } from './pdfStyles'
import PDFEntityItem from './PDFEntityItem'
import type { Cluster } from '../../types'

interface PDFClusterSectionProps {
  cluster: Cluster
  clusterNumber: number
}

export default function PDFClusterSection({ cluster, clusterNumber }: PDFClusterSectionProps) {
  // Defensive checks
  if (!cluster) return null
  const name = cluster.name || 'Untitled Cluster'
  const summary = cluster.summary || ''
  const entities = Array.isArray(cluster.entities) ? cluster.entities : []

  return (
    <View style={styles.clusterSection}>
      {/* Cluster title - wrap={false} removed to allow large clusters to break across pages */}
      <Text style={styles.clusterTitle} hyphenationCallback={word => [word]}>
        {clusterNumber}. {name}
      </Text>

      {/* Cluster summary */}
      <Text style={styles.clusterSummary}>{summary}</Text>

      {/* Cluster metadata */}
      <Text style={styles.clusterMeta}>
        {entities.length} {entities.length === 1 ? 'entity' : 'entities'}
      </Text>

      {/* Entities */}
      {entities.map((entity, idx) => (
        <PDFEntityItem key={entity.id || `entity-${idx}`} entity={entity} />
      ))}
    </View>
  )
}
