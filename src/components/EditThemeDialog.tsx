import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { X, Plus } from 'lucide-react'
import type { Theme } from '../types'

interface EditThemeDialogProps {
  theme: Theme
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (theme: Theme) => void
}

export default function EditThemeDialog({ theme, open, onOpenChange, onSave }: EditThemeDialogProps) {
  const [formData, setFormData] = useState<Theme>(theme)
  const [newTag, setNewTag] = useState('')

  // Reset form data when theme changes or dialog opens
  useEffect(() => {
    setFormData(theme)
    setNewTag('')
  }, [theme, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Auto-calculate cluster count from clusters array
    const updatedTheme = {
      ...formData,
      clusterCount: formData.clusters?.length || 0
    }
    onSave(updatedTheme)
  }

  const addSource = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !formData.sources.includes(trimmedTag)) {
      setFormData({
        ...formData,
        sources: [...formData.sources, trimmedTag]
      })
      setNewTag('')
    }
  }

  const removeSource = (sourceToRemove: string) => {
    setFormData({
      ...formData,
      sources: formData.sources.filter(s => s !== sourceToRemove)
    })
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSource()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {theme.title ? 'Edit Theme' : 'Add New Theme'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              Theme Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Users struggle to validate decisions without peer input"
              required
              className="text-lg"
            />
            <p className="text-xs text-gray-500">
              Make this a clear, declarative statement of the insight
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-semibold">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide context and explain what this theme represents..."
              required
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              2-3 sentences contextualizing the theme
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color" className="text-base font-semibold">
              Theme Color
            </Label>
            <Select
              value={formData.color}
              onValueChange={(value) => setFormData({ ...formData, color: value as Theme['color'] })}
            >
              <SelectTrigger id="color">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="cyan">Cyan</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Cluster count ({formData.clusters?.length || 0}) is calculated automatically
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Sources
            </Label>

            {/* Display existing source tags */}
            {formData.sources.length > 0 && (
              <div className="flex gap-2 flex-wrap p-3 bg-gray-50 rounded-lg border border-gray-200">
                {formData.sources.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200"
                  >
                    {source}
                    <button
                      type="button"
                      onClick={() => removeSource(source)}
                      className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                      title={`Remove ${source}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add new tag input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add a new source (e.g., JTBD Clusters)"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addSource}
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={!newTag.trim()}
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Add tags for data sources like "JTBD Clusters", "Atomic Facts", "Transcripts", etc.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> To add clusters and entities, edit the research-data.json file directly.
              This dialog only edits theme-level information.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Theme
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
