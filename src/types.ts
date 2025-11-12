export interface Entity {
  id: string
  statement: string
  type: 'jtbd' | 'fact' | 'pain' | 'gain'
  pains?: string[]
  gains?: string[]
  source: string
  transcriptId: string
  participantId: string
  timestamp: string
  date: string
  verbatimQuote: string
  context: string
}

export interface Cluster {
  id: string
  name: string
  summary: string
  entityCount: number
  entities: Entity[]
}

export interface Theme {
  id: string
  title: string
  description: string
  sources: string[]
  clusterCount: number
  color: 'blue' | 'green' | 'amber' | 'purple' | 'rose' | 'cyan'
  clusters: Cluster[]
}
