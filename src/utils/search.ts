import Fuse from 'fuse.js'
import type { Theme, Cluster, Entity } from '../types'

export interface SearchResult {
  type: 'theme' | 'cluster' | 'entity'
  item: Theme | Cluster | Entity
  matches?: Array<{
    key: string
    value: string
    indices: Array<[number, number]>
  }>
  theme?: Theme
  cluster?: Cluster
}

// Configure fuzzy search options
const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.4, // 0.0 is perfect match, 1.0 matches everything
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1.5 },
    { name: 'name', weight: 2 },
    { name: 'summary', weight: 1.5 },
    { name: 'statement', weight: 1.5 },
    { name: 'verbatimQuote', weight: 1 },
    { name: 'context', weight: 0.8 },
    { name: 'source', weight: 0.5 }
  ]
}

export function searchAcrossAllLevels(
  themes: Theme[],
  query: string
): SearchResult[] {
  if (!query.trim()) {
    return []
  }

  const results: SearchResult[] = []

  // Search themes
  const themeFuse = new Fuse(themes, {
    ...fuseOptions,
    keys: ['title', 'description']
  })

  const themeResults = themeFuse.search(query)
  themeResults.forEach((result) => {
    results.push({
      type: 'theme',
      item: result.item,
      matches: result.matches as any,
      theme: result.item
    })
  })

  // Search clusters
  themes.forEach((theme) => {
    const clusterFuse = new Fuse(theme.clusters, {
      ...fuseOptions,
      keys: ['name', 'summary']
    })

    const clusterResults = clusterFuse.search(query)
    clusterResults.forEach((result) => {
      results.push({
        type: 'cluster',
        item: result.item,
        matches: result.matches as any,
        theme,
        cluster: result.item
      })
    })

    // Search entities
    theme.clusters.forEach((cluster) => {
      const entityFuse = new Fuse(cluster.entities, {
        ...fuseOptions,
        keys: ['statement', 'verbatimQuote', 'context', 'source']
      })

      const entityResults = entityFuse.search(query)
      entityResults.forEach((result) => {
        results.push({
          type: 'entity',
          item: result.item,
          matches: result.matches as any,
          theme,
          cluster
        })
      })
    })
  })

  return results
}

// Highlight text matches for display
export function highlightMatches(
  text: string,
  indices: Array<[number, number]> = []
): Array<{ text: string; isMatch: boolean }> {
  if (!indices.length) {
    return [{ text, isMatch: false }]
  }

  const result: Array<{ text: string; isMatch: boolean }> = []
  let lastIndex = 0

  // Sort indices by start position
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0])

  sortedIndices.forEach(([start, end]) => {
    // Add text before match
    if (start > lastIndex) {
      result.push({
        text: text.slice(lastIndex, start),
        isMatch: false
      })
    }

    // Add matched text
    result.push({
      text: text.slice(start, end + 1),
      isMatch: true
    })

    lastIndex = end + 1
  })

  // Add remaining text
  if (lastIndex < text.length) {
    result.push({
      text: text.slice(lastIndex),
      isMatch: false
    })
  }

  return result
}

// Get a preview snippet around the match
export function getMatchPreview(
  text: string,
  indices: Array<[number, number]> = [],
  maxLength: number = 150
): string {
  if (!indices.length || !text) {
    return text.slice(0, maxLength)
  }

  const [start, end] = indices[0]
  const matchCenter = Math.floor((start + end) / 2)
  const halfLength = Math.floor(maxLength / 2)

  let snippetStart = Math.max(0, matchCenter - halfLength)
  let snippetEnd = Math.min(text.length, matchCenter + halfLength)

  let snippet = text.slice(snippetStart, snippetEnd)

  if (snippetStart > 0) {
    snippet = '...' + snippet
  }
  if (snippetEnd < text.length) {
    snippet = snippet + '...'
  }

  return snippet
}
