import { Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import type { Cluster } from '../types'

interface ClusterCardProps {
  cluster: Cluster
  onClick: () => void
  editMode?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export default function ClusterCard({ cluster, onClick, editMode, onEdit, onDelete }: ClusterCardProps) {
  const handleClick = () => {
    if (!editMode) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-xl padding-fluid border border-gray-200 hover:border-blue-400
                 hover:shadow-md transition-all duration-300 relative group
                 ${!editMode ? 'cursor-pointer' : ''}`}
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
              onEdit?.(  )
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
              if (confirm('Are you sure you want to delete this cluster?')) {
                onDelete?.()
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Smaller than theme, semibold (18-20pt) */}
      <h3 className={`text-fluid-xl font-semibold text-gray-800 mb-fluid-sm leading-tight ${editMode ? 'pr-20' : ''}`}>
        {cluster.name}
      </h3>

      {/* Body text (14-16pt) */}
      <p className="text-fluid-sm text-gray-600 mb-fluid leading-normal line-clamp-3">
        {cluster.summary}
      </p>
      
      {/* Small metadata (12pt) */}
      <div className="text-fluid-xs text-gray-500 font-medium">
        {cluster.entityCount} entities
      </div>
    </div>
  )
}
