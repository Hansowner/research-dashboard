import { Text, View } from '@react-pdf/renderer'
import { styles } from './pdfStyles'

interface PDFFooterProps {
  exportDate: string
}

export default function PDFFooter({ exportDate }: PDFFooterProps) {
  return (
    <View fixed>
      <View style={styles.footerBorder} />
      <View style={styles.footer}>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
        <Text>{exportDate}</Text>
      </View>
    </View>
  )
}
