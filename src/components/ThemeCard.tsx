import { Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import type { Theme } from '../types'

interface ThemeCardProps {
  theme: Theme
  onClick: () => void
  editMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const themeColors = {
  blue: {
    accent: 'border-l-4 border-blue-500',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  green: {
    accent: 'border-l-4 border-green-500',
    bg: 'bg-green-50',
    badge: 'bg-green-100 text-green-700 border-green-200'
  },
  amber: {
    accent: 'border-l-4 border-amber-500',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  purple: {
    accent: 'border-l-4 border-purple-500',
    bg: 'bg-purple-50',
    badge: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  rose: {
    accent: 'border-l-4 border-rose-500',
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700 border-rose-200'
  },
  cyan: {
    accent: 'border-l-4 border-cyan-500',
    bg: 'bg-cyan-50',
    badge: 'bg-cyan-100 text-cyan-700 border-cyan-200'
  }
}

const sourceColors: Record<string, string> = {
  'JTBD Clusters': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  'Atomic Facts': 'bg-cyan-100 text-cyan-700 border border-cyan-200',
  'Transcripts': 'bg-purple-100 text-purple-700 border border-purple-200',
  'Surveys': 'bg-pink-100 text-pink-700 border border-pink-200'
}

export default function ThemeCard({ theme, onClick, editMode, onEdit, onDelete }: ThemeCardProps) {
  const colorScheme = themeColors[theme.color] || themeColors.blue

  const handleClick = () => {
    if (!editMode) {
      onClick()
    }
  }

  return (
    <div
      className={`
        bg-white rounded-xl padding-fluid-lg
        shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.08)]
        transition-all duration-300 relative group
        ${!editMode ? 'cursor-pointer' : ''}
        ${colorScheme.accent}
      `}
      onClick={handleClick}
    >
      {/* Edit/Delete buttons */}
      {editMode && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-white"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-white text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Are you sure you want to delete this theme?')) {
                onDelete?.()
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Level 1: Large, bold title (28-32pt) */}
      <h2 className={`text-fluid-3xl font-bold text-gray-900 mb-fluid-sm leading-tight ${editMode ? 'pr-20' : ''}`}>
        {theme.title}
      </h2>

      {/* Level 2: Medium description (16pt) */}
      <p className="text-fluid-base text-gray-600 mb-fluid leading-normal line-clamp-3">
        {theme.description}
      </p>
      
      {/* Level 3: Small source badges (12pt) */}
      <div className="flex gap-2 flex-wrap mb-4">
        {theme.sources.map((source) => (
          <span
            key={source}
            className={`text-xs px-3 py-1 rounded-full ${sourceColors[source] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}
          >
            {source}
          </span>
        ))}
      </div>
      
      {/* Level 4: Tiny metadata (10pt) */}
      <div className="flex items-center gap-2">
        <div className="text-fluid-xs text-gray-500 uppercase tracking-wide font-medium">
          {theme.clusterCount} clusters
        </div>
      </div>
    </div>
  )
}
