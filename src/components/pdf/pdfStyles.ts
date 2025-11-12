import { StyleSheet } from '@react-pdf/renderer'

// Color palette matching dashboard theme colors
export const pdfThemeColors = {
  blue: {
    accent: '#3B82F6',
    background: '#EFF6FF',
    text: '#1E40AF'
  },
  green: {
    accent: '#10B981',
    background: '#ECFDF5',
    text: '#065F46'
  },
  amber: {
    accent: '#F59E0B',
    background: '#FFFBEB',
    text: '#92400E'
  },
  purple: {
    accent: '#8B5CF6',
    background: '#FAF5FF',
    text: '#5B21B6'
  },
  rose: {
    accent: '#F43F5E',
    background: '#FFF1F2',
    text: '#9F1239'
  },
  cyan: {
    accent: '#06B6D4',
    background: '#ECFEFF',
    text: '#155E75'
  }
}

// Create styles for PDF components
export const styles = StyleSheet.create({
  // Page setup
  page: {
    padding: '15mm 15mm',
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#111827'
  },

  // Title page
  titlePage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: '80mm'
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827'
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#374151'
  },
  titleDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 30
  },
  titleStats: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 60
  },
  titleFooter: {
    fontSize: 10,
    color: '#9CA3AF',
    position: 'absolute',
    bottom: 40
  },

  // Headers & Footers
  header: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 10,
    paddingBottom: 8
    // borderBottom removed - causes clipBorderTop overflow with large Views
  },
  headerBorder: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 10
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    color: '#9CA3AF',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
    // borderTop removed - causes clipBorderTop overflow with large Views
  },
  footerBorder: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 8
  },

  // Theme level (H1 equivalent)
  themeSection: {
    marginBottom: 20
  },
  themeHeader: {
    marginBottom: 15
  },
  themeAccentBar: {
    width: '100%',
    height: 4,
    marginBottom: 10
  },
  themeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    orphans: 2,
    widows: 2,
    maxWidth: '100%',
    lineHeight: 1.4,
    textAlign: 'left'
  },
  themeDescription: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#4B5563',
    marginBottom: 12
  },
  themeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  themeMetaText: {
    fontSize: 9,
    color: '#6B7280',
    marginRight: 15
  },

  // Cluster level (H2 equivalent)
  clusterSection: {
    marginTop: 12,
    marginBottom: 10,
    paddingLeft: 10
    // borderLeft removed - causes clipBorderTop overflow with large Views
  },
  clusterTitle: {
    fontSize: 16,
    fontWeight: 'semibold',
    marginBottom: 8,
    color: '#1F2937',
    orphans: 2,
    widows: 2,
    maxWidth: '100%',
    lineHeight: 1.4,
    textAlign: 'left'
  },
  clusterSummary: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#4B5563',
    marginBottom: 10
  },
  clusterMeta: {
    fontSize: 8,
    color: '#9CA3AF',
    marginBottom: 12
  },

  // Entity level (Body text)
  entityContainer: {
    marginBottom: 10,
    paddingLeft: 15
    // breakInside: 'avoid' removed to allow large entities to break across pages
  },
  entityStatement: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 8,
    fontWeight: 'medium'
  },

  // Pains and Gains
  painGainSection: {
    marginLeft: 10,
    marginBottom: 6
  },
  painGainLabel: {
    fontSize: 9,
    fontWeight: 'semibold',
    marginBottom: 4
  },
  painLabel: {
    color: '#DC2626'
  },
  gainLabel: {
    color: '#10B981'
  },
  painGainList: {
    marginLeft: 8
  },
  painGainItem: {
    fontSize: 9,
    color: '#4B5563',
    marginBottom: 2,
    flexDirection: 'row'
  },
  painGainBullet: {
    marginRight: 6,
    fontWeight: 'bold'
  },
  painBullet: {
    color: '#DC2626'
  },
  gainBullet: {
    color: '#10B981'
  },

  // Verbatim quotes
  verbatimQuote: {
    fontSize: 9,
    fontFamily: 'Courier',
    fontStyle: 'italic',
    color: '#1F2937',
    backgroundColor: '#EFF6FF',
    padding: 8,
    marginTop: 6,
    marginBottom: 8,
    marginLeft: 10
    // borderLeft removed - causes clipBorderTop overflow with large Views
  },

  // Entity metadata
  entityMetadata: {
    fontSize: 8,
    color: '#6B7280',
    marginTop: 6,
    marginLeft: 10,
    lineHeight: 1.4
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 2
  },
  metadataLabel: {
    fontWeight: 'semibold',
    marginRight: 4
  },
  metadataValue: {
    marginRight: 12
  },

  // Badges/pills
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  badge: {
    fontSize: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
    // borderRadius: 12,  // REMOVED: Causes numerical overflow error in @react-pdf/renderer v4.x when combined with backgroundColor
    // paddingHorizontal/paddingVertical replaced with explicit properties to avoid numerical overflow bug in v4.x
    marginRight: 6,
    marginBottom: 4
  },

  // Dividers - using backgroundColor to create horizontal lines (borderTop causes clipBorderTop overflow)
  // marginVertical replaced with explicit properties to avoid numerical overflow bug in @react-pdf/renderer v4.x
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 15,
    marginBottom: 15
  },
  sectionDivider: {
    width: '100%',
    height: 2,
    backgroundColor: '#D1D5DB',
    marginTop: 12,
    marginBottom: 12
  },

  // Table of Contents (if needed)
  tocTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827'
  },
  tocItem: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tocSubItem: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 6,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tocDots: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 3,
    height: 1,
    backgroundColor: '#D1D5DB'
    // marginHorizontal replaced with explicit properties to avoid numerical overflow bug in @react-pdf/renderer v4.x
    // borderBottom removed - causes clipBorderTop overflow with large Views
  },
  tocPageNumber: {
    color: '#6B7280'
  }
})
