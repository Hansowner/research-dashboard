import { Text, View } from '@react-pdf/renderer'
import { styles } from './pdfStyles'
import type { Entity } from '../../types'

interface PDFEntityItemProps {
  entity: Entity
}

export default function PDFEntityItem({ entity }: PDFEntityItemProps) {
  // AGGRESSIVE truncation to prevent coordinate overflow in pdfkit
  // These limits ensure entities stay within safe rendering bounds
  const MAX_STATEMENT_LENGTH = 300
  const MAX_PAIN_GAIN_LENGTH = 100
  const MAX_PAIN_GAIN_COUNT = 3
  const MAX_VERBATIM_LENGTH = 150

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return text
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text
  }

  const truncatedStatement = truncateText(entity.statement, MAX_STATEMENT_LENGTH)
  const truncatedPains = entity.pains?.slice(0, MAX_PAIN_GAIN_COUNT).map(p => truncateText(p, MAX_PAIN_GAIN_LENGTH))
  const truncatedGains = entity.gains?.slice(0, MAX_PAIN_GAIN_COUNT).map(g => truncateText(g, MAX_PAIN_GAIN_LENGTH))
  const truncatedQuote = truncateText(entity.verbatimQuote, MAX_VERBATIM_LENGTH)

  return (
    <View style={styles.entityContainer}>
      {/* Entity statement - truncated to prevent overflow */}
      <Text style={styles.entityStatement}>• {truncatedStatement}</Text>

      {/* Pains - limited to 3, truncated */}
      {truncatedPains && truncatedPains.length > 0 && (
        <View style={styles.painGainSection}>
          <Text style={[styles.painGainLabel, styles.painLabel]}>Pains:</Text>
          <View style={styles.painGainList}>
            {truncatedPains.map((pain, idx) => (
              <View key={idx} style={styles.painGainItem}>
                <Text style={[styles.painGainBullet, styles.painBullet]}>−</Text>
                <Text>{pain}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Gains - limited to 3, truncated */}
      {truncatedGains && truncatedGains.length > 0 && (
        <View style={styles.painGainSection}>
          <Text style={[styles.painGainLabel, styles.gainLabel]}>Gains:</Text>
          <View style={styles.painGainList}>
            {truncatedGains.map((gain, idx) => (
              <View key={idx} style={styles.painGainItem}>
                <Text style={[styles.painGainBullet, styles.gainBullet]}>+</Text>
                <Text>{gain}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Verbatim quote - truncated to max 150 chars to prevent coordinate overflow */}
      {truncatedQuote && (
        <View style={styles.verbatimQuote}>
          <Text>"{truncatedQuote}"</Text>
        </View>
      )}

      {/* Metadata */}
      <View style={styles.entityMetadata}>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Source:</Text>
          <Text style={styles.metadataValue}>{entity.source}</Text>
          <Text style={styles.metadataLabel}>Transcript:</Text>
          <Text style={styles.metadataValue}>{entity.transcriptId}</Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataLabel}>Participant:</Text>
          <Text style={styles.metadataValue}>{entity.participantId}</Text>
          <Text style={styles.metadataLabel}>Date:</Text>
          <Text style={styles.metadataValue}>{entity.date}</Text>
          <Text style={styles.metadataLabel}>Time:</Text>
          <Text style={styles.metadataValue}>{entity.timestamp}</Text>
        </View>
      </View>
    </View>
  )
}
