import { Minus, Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import type { Entity } from '../types'

interface EntityItemProps {
  entity: Entity
  onClick: () => void
  editMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

const sourceColors: Record<string, string> = {
  'Interview #47': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Interview #52': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Interview #61': 'bg-slate-100 text-slate-700 border border-slate-200',
  'Survey Response': 'bg-pink-100 text-pink-700 border border-pink-200'
}

export default function EntityItem({ entity, onClick, editMode, onEdit, onDelete }: EntityItemProps) {
  const handleClick = () => {
    if (!editMode) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white padding-fluid-sm rounded border-l-4 border-gray-200
                 hover:border-l-4 hover:border-blue-400 hover:shadow-sm
                 transition-all duration-300 relative group
                 ${!editMode ? 'cursor-pointer' : ''}`}
    >
      {/* Edit/Delete buttons */}
      {editMode && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-white"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.()
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-7 w-7 bg-white text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              if (confirm('Are you sure you want to delete this entity?')) {
                onDelete?.()
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Body text scale - readable (14-15pt) */}
      <p className={`text-fluid-sm text-gray-700 leading-normal mb-fluid-sm ${editMode ? 'pr-16' : ''}`}>
        {entity.statement}
      </p>
      
      {/* Pains */}
      {entity.pains && entity.pains.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-3 h-3 text-red-600" />
            <span className="text-sm font-medium text-red-600">Pains</span>
          </div>
          <ul className="text-sm text-gray-600 ml-5 space-y-1.5">
            {entity.pains.map((pain, i) => (
              <li key={i}>− {pain}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Gains */}
      {entity.gains && entity.gains.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Plus className="w-3 h-3 text-green-600" />
            <span className="text-sm font-medium text-green-600">Gains</span>
          </div>
          <ul className="text-sm text-gray-600 ml-5 space-y-1.5">
            {entity.gains.map((gain, i) => (
              <li key={i}>+ {gain}</li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Tiny source metadata (11pt) */}
      <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-400 pt-2 border-t border-gray-100">
        <span className={`px-2 py-1 rounded ${sourceColors[entity.source] || 'bg-gray-100 text-gray-700'}`}>
          {entity.source}
        </span>
        <span>•</span>
        <span>{entity.transcriptId}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className="ml-auto text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          View source
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
