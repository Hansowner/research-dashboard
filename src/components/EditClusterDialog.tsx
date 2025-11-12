import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import type { Cluster } from '../types'

interface EditClusterDialogProps {
  cluster: Cluster
  themeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (cluster: Cluster, themeId: string) => void
}

export default function EditClusterDialog({
  cluster,
  themeId,
  open,
  onOpenChange,
  onSave,
}: EditClusterDialogProps) {
  const [formData, setFormData] = useState<Cluster>(cluster)

  // Reset form data when dialog opens with new cluster
  useEffect(() => {
    setFormData(cluster)
  }, [cluster, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim() || !formData.summary.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // Auto-calculate entityCount from entities array
    const updatedCluster = {
      ...formData,
      entityCount: formData.entities.length
    }

    onSave(updatedCluster, themeId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {cluster.id.startsWith('c' + Date.now().toString().slice(0, -3)) ? 'Add New Cluster' : 'Edit Cluster'}
          </DialogTitle>
          <DialogDescription>
            Update cluster information. Entity count is automatically calculated from the entities array.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Cluster Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Cluster Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Need for Better Organization"
                required
              />
            </div>

            {/* Cluster Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary" className="text-sm font-medium">
                Summary <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief description of this cluster's key insights"
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Entity Count (Read-only) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Entity Count (Auto-calculated)
              </Label>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded border">
                {formData.entities.length} entities
              </div>
            </div>

            <div className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded p-3">
              <strong>Note:</strong> To add or edit entities within this cluster, use the entity-level editing
              controls when viewing the cluster's entities.
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Cluster
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
