import { useState, useEffect } from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import type { Entity } from '../types'

interface EditEntityDialogProps {
  entity: Entity
  themeId: string
  clusterId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entity: Entity, themeId: string, clusterId: string) => void
}

export default function EditEntityDialog({
  entity,
  themeId,
  clusterId,
  open,
  onOpenChange,
  onSave,
}: EditEntityDialogProps) {
  const [formData, setFormData] = useState<Entity>(entity)
  const [newPain, setNewPain] = useState('')
  const [newGain, setNewGain] = useState('')

  // Reset form data when dialog opens with new entity
  useEffect(() => {
    setFormData(entity)
    setNewPain('')
    setNewGain('')
  }, [entity, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.statement.trim()) {
      alert('Statement is required')
      return
    }

    onSave(formData, themeId, clusterId)
  }

  // Pain management
  const addPain = () => {
    const trimmedPain = newPain.trim()
    if (trimmedPain && !formData.pains?.includes(trimmedPain)) {
      setFormData({
        ...formData,
        pains: [...(formData.pains || []), trimmedPain]
      })
      setNewPain('')
    }
  }

  const removePain = (painToRemove: string) => {
    setFormData({
      ...formData,
      pains: formData.pains?.filter(p => p !== painToRemove) || []
    })
  }

  const handlePainKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addPain()
    }
  }

  // Gain management
  const addGain = () => {
    const trimmedGain = newGain.trim()
    if (trimmedGain && !formData.gains?.includes(trimmedGain)) {
      setFormData({
        ...formData,
        gains: [...(formData.gains || []), trimmedGain]
      })
      setNewGain('')
    }
  }

  const removeGain = (gainToRemove: string) => {
    setFormData({
      ...formData,
      gains: formData.gains?.filter(g => g !== gainToRemove) || []
    })
  }

  const handleGainKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addGain()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {entity.id.startsWith('e' + Date.now().toString().slice(0, -3)) ? 'Add New Entity' : 'Edit Entity'}
          </DialogTitle>
          <DialogDescription>
            Update entity information, pains/gains, and source metadata.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* SECTION 1: Core Content */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Core Content</h3>

              {/* Statement */}
              <div className="space-y-2">
                <Label htmlFor="statement" className="text-sm font-medium">
                  Statement <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="statement"
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  placeholder="Main insight or finding from research"
                  className="min-h-[80px]"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'jtbd' | 'fact' | 'pain' | 'gain') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jtbd">JTBD (Jobs to be Done)</SelectItem>
                    <SelectItem value="fact">Fact</SelectItem>
                    <SelectItem value="pain">Pain</SelectItem>
                    <SelectItem value="gain">Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SECTION 2: Pains & Gains */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Pains & Gains</h3>

              {/* Pains */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-red-600">Pains</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {formData.pains?.map((pain) => (
                    <span
                      key={pain}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm"
                    >
                      {pain}
                      <button
                        type="button"
                        onClick={() => removePain(pain)}
                        className="hover:bg-red-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newPain}
                    onChange={(e) => setNewPain(e.target.value)}
                    onKeyDown={handlePainKeyDown}
                    placeholder="Add a pain point..."
                  />
                  <Button type="button" onClick={addPain} variant="outline" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Gains */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-600">Gains</Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {formData.gains?.map((gain) => (
                    <span
                      key={gain}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm"
                    >
                      {gain}
                      <button
                        type="button"
                        onClick={() => removeGain(gain)}
                        className="hover:bg-green-100 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newGain}
                    onChange={(e) => setNewGain(e.target.value)}
                    onKeyDown={handleGainKeyDown}
                    placeholder="Add a gain..."
                  />
                  <Button type="button" onClick={addGain} variant="outline" size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* SECTION 3: Source Metadata */}
            <div className="space-y-4 pb-4 border-b">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Source Metadata</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source" className="text-sm font-medium">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g., Interview #47"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transcriptId" className="text-sm font-medium">Transcript ID</Label>
                  <Input
                    id="transcriptId"
                    value={formData.transcriptId}
                    onChange={(e) => setFormData({ ...formData, transcriptId: e.target.value })}
                    placeholder="e.g., T47-20240308"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participantId" className="text-sm font-medium">Participant ID</Label>
                  <Input
                    id="participantId"
                    value={formData.participantId}
                    onChange={(e) => setFormData({ ...formData, participantId: e.target.value })}
                    placeholder="e.g., P047"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g., 2024-03-08"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="timestamp" className="text-sm font-medium">Timestamp</Label>
                  <Input
                    id="timestamp"
                    value={formData.timestamp}
                    onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                    placeholder="e.g., 00:12:34"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Transcript Data */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Transcript Data</h3>

              <div className="space-y-2">
                <Label htmlFor="verbatimQuote" className="text-sm font-medium">Verbatim Quote</Label>
                <Textarea
                  id="verbatimQuote"
                  value={formData.verbatimQuote}
                  onChange={(e) => setFormData({ ...formData, verbatimQuote: e.target.value })}
                  placeholder="Direct quote from participant..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="context" className="text-sm font-medium">Context</Label>
                <Textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="Contextual information about this insight..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Entity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
