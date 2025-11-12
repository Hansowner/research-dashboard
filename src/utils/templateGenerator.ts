import type { Theme } from '../types'

interface DataState {
  themes: Theme[]
}

export const templates = {
  minimal: (): DataState => ({
    themes: [
      {
        id: 't1',
        title: 'Your Theme Title Here',
        description: 'Describe what this theme represents...',
        sources: ['Source Type 1', 'Source Type 2'],
        clusterCount: 1,
        color: 'blue',
        clusters: [
          {
            id: 'c1',
            name: 'Your Cluster Name',
            summary: 'Summary of what this cluster represents...',
            entityCount: 1,
            entities: [
              {
                id: 'e1',
                statement: 'The main finding or insight statement',
                type: 'jtbd',
                source: 'Interview #1',
                transcriptId: 'T-001',
                participantId: 'P-001',
                timestamp: '00:00',
                date: 'Jan 1, 2024',
                verbatimQuote: 'The exact words the participant said...',
                context: 'The question or context that prompted this response...'
              }
            ]
          }
        ]
      }
    ]
  }),

  example: (): DataState => ({
    themes: [
      {
        id: 't1',
        title: 'Users need better collaboration tools',
        description: 'Research participants consistently mentioned challenges when working with teammates. They want seamless ways to share work, get feedback, and stay aligned without excessive meetings.',
        sources: ['User Interviews', 'Survey Results', 'Usage Analytics'],
        clusterCount: 2,
        color: 'blue',
        clusters: [
          {
            id: 'c1',
            name: 'Async Communication Needs',
            summary: 'Users want to communicate without scheduling meetings',
            entityCount: 2,
            entities: [
              {
                id: 'e1',
                statement: 'When I need feedback on my work, I want to share it asynchronously, so that I don\'t have to schedule yet another meeting.',
                type: 'jtbd',
                pains: ['Too many meetings', 'Slow feedback cycles'],
                gains: ['More focused work time', 'Faster iterations'],
                source: 'Interview #12',
                transcriptId: 'T-012',
                participantId: 'P-008',
                timestamp: '15:42',
                date: 'Jan 15, 2024',
                verbatimQuote: 'I\'m so tired of meetings. Can\'t I just share my screen recording and get comments?',
                context: 'Question: How do you currently get feedback on your work?'
              },
              {
                id: 'e2',
                statement: 'Meeting fatigue is real and impacts productivity',
                type: 'pain',
                pains: ['Mental exhaustion', 'Context switching'],
                source: 'Interview #15',
                transcriptId: 'T-015',
                participantId: 'P-011',
                timestamp: '22:10',
                date: 'Jan 18, 2024',
                verbatimQuote: 'By 3pm I\'m completely drained from back-to-back calls.',
                context: 'Question: Describe your typical workday'
              }
            ]
          },
          {
            id: 'c2',
            name: 'Real-time Awareness',
            summary: 'Teams want to know what others are working on without asking',
            entityCount: 1,
            entities: [
              {
                id: 'e3',
                statement: 'Visibility into team progress reduces uncertainty',
                type: 'gain',
                gains: ['Reduced anxiety', 'Better planning', 'Less duplication'],
                source: 'Interview #20',
                transcriptId: 'T-020',
                participantId: 'P-014',
                timestamp: '08:30',
                date: 'Jan 25, 2024',
                verbatimQuote: 'When I can see the dashboard and know where everyone is at, I sleep better.',
                context: 'Question: What helps you feel confident about team progress?'
              }
            ]
          }
        ]
      }
    ]
  }),

  full: (): DataState => ({
    themes: [
      {
        id: 't1',
        title: 'Decision-making requires peer validation',
        description: 'Users struggle to make confident decisions without input from trusted colleagues. They seek validation mechanisms before committing to important choices.',
        sources: ['JTBD Clusters', 'Atomic Facts', 'Interview Transcripts'],
        clusterCount: 2,
        color: 'purple',
        clusters: [
          {
            id: 'c1',
            name: 'Collaborative Decision Validation',
            summary: 'Users want to share decisions with colleagues before finalizing',
            entityCount: 2,
            entities: [
              {
                id: 'e1',
                statement: 'When making product decisions, I want to run them by my team first, so I can catch blindspots before exec meetings.',
                type: 'jtbd',
                pains: ['Fear of public mistakes', 'Lack of confidence'],
                gains: ['Increased confidence', 'Better decisions', 'Team alignment'],
                source: 'Interview #47',
                transcriptId: 'T-032',
                participantId: 'P-023',
                timestamp: '31:42',
                date: 'Nov 8, 2024',
                verbatimQuote: 'I never feel confident unless I\'ve bounced the idea off Sarah and Mike first.',
                context: 'Question: Tell me about a time you felt uncertain about a decision'
              },
              {
                id: 'e2',
                statement: 'Assumption validation prevents costly mistakes',
                type: 'fact',
                source: 'Interview #48',
                transcriptId: 'T-033',
                participantId: 'P-024',
                timestamp: '15:30',
                date: 'Nov 9, 2024',
                verbatimQuote: 'The worst feeling is presenting something and realizing you missed an obvious angle.',
                context: 'Question: What makes you hesitate before sharing ideas?'
              }
            ]
          },
          {
            id: 'c2',
            name: 'Trust Through Transparency',
            summary: 'Users need to see reasoning to trust decisions',
            entityCount: 1,
            entities: [
              {
                id: 'e3',
                statement: 'Transparent reasoning builds trust in tools',
                type: 'gain',
                gains: ['Increased adoption', 'Trust', 'Learning opportunities'],
                source: 'Interview #49',
                transcriptId: 'T-034',
                participantId: 'P-025',
                timestamp: '22:10',
                date: 'Nov 10, 2024',
                verbatimQuote: 'I don\'t trust black boxes. If you can\'t explain why, I won\'t use it.',
                context: 'Question: How do you evaluate new tools?'
              }
            ]
          }
        ]
      },
      {
        id: 't2',
        title: 'Time-sensitive workflows need automation',
        description: 'Manual processes create bottlenecks in time-critical work. Users need intelligent automation that handles routine tasks without oversight.',
        sources: ['User Interviews', 'Workflow Analysis'],
        clusterCount: 1,
        color: 'green',
        clusters: [
          {
            id: 'c3',
            name: 'Routine Task Automation',
            summary: 'Repetitive tasks should run without human intervention',
            entityCount: 1,
            entities: [
              {
                id: 'e4',
                statement: 'When deadlines approach, I want routine tasks automated, so I can focus on high-value work.',
                type: 'jtbd',
                pains: ['Time wasted on routine work', 'Missed deadlines'],
                gains: ['More strategic work time', 'Reduced stress'],
                source: 'Interview #52',
                transcriptId: 'T-037',
                participantId: 'P-028',
                timestamp: '12:15',
                date: 'Nov 12, 2024',
                verbatimQuote: 'Why am I manually doing this every week? A robot should handle this.',
                context: 'Question: What parts of your job feel like busywork?'
              }
            ]
          }
        ]
      }
    ]
  })
}

export function downloadTemplate(type: keyof typeof templates, filename?: string) {
  const template = templates[type]()
  const jsonStr = JSON.stringify(template, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `research-data-${type}-template.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getTemplateAsString(type: keyof typeof templates): string {
  return JSON.stringify(templates[type](), null, 2)
}
