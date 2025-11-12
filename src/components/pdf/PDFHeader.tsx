import { Text, View } from '@react-pdf/renderer'
import { styles } from './pdfStyles'

export default function PDFHeader() {
  return (
    <View fixed>
      <View style={styles.header}>
        <Text>Research Synthesis Report</Text>
      </View>
      <View style={styles.headerBorder} />
    </View>
  )
}
