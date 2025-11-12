import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, Edit, Plus, Upload, RotateCcw, Clock, FileText, FileDown } from 'lucide-react'
import ThemeCard from './ThemeCard'
import ClusterCard from './ClusterCard'
import EntityItem from './EntityItem'
import SourceModal from './SourceModal'
import Breadcrumb from './Breadcrumb'
import EditThemeDialog from './EditThemeDialog'
import EditClusterDialog from './EditClusterDialog'
import EditEntityDialog from './EditEntityDialog'
import SearchBar from './SearchBar'
import ImportGuideModal from './ImportGuideModal'
import { Button } from './ui/button'
import { useDataPersistence } from '../hooks/useDataPersistence'
import type { SearchResult } from '../utils/search'
import type { Theme, Cluster, Entity } from '../types'

export default function ResearchDashboard() {
  const {
    data,
    setData,
    isLoading,
    lastSaved,
    exportToJSON,
    importFromJSON,
    resetToDefault,
    exportToPDF
  } = useDataPersistence()

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const [editingCluster, setEditingCluster] = useState<{ cluster: Cluster; themeId: string } | null>(null)
  const [editingEntity, setEditingEntity] = useState<{ entity: Entity; themeId: string; clusterId: string } | null>(null)
  const [importGuideOpen, setImportGuideOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modals and entity detail
      if (e.key === 'Escape') {
        if (selectedEntity) {
          setSelectedEntity(null)
        } else if (editingEntity) {
          setEditingEntity(null)
        } else if (editingCluster) {
          setEditingCluster(null)
        } else if (editingTheme) {
          setEditingTheme(null)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEntity, editingEntity, editingCluster, editingTheme])

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      importFromJSON(file)
    }
    // Reset input to allow importing the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSearchResultClick = (result: SearchResult) => {
    // Navigate to the appropriate level based on search result type
    if (result.type === 'theme') {
      setSelectedTheme(result.theme || null)
      setSelectedCluster(null)
    } else if (result.type === 'cluster') {
      setSelectedTheme(result.theme || null)
      setSelectedCluster(result.cluster || null)
    } else if (result.type === 'entity') {
      setSelectedTheme(result.theme || null)
      setSelectedCluster(result.cluster || null)
      setSelectedEntity(result.item as Entity)
    }
  }

  const getBreadcrumbPath = () => {
    const path = ['Themes']
    if (selectedTheme) {
      path.push(selectedTheme.title)
    }
    if (selectedCluster) {
      path.push(selectedCluster.name)
    }
    return path
  }

  const handleBreadcrumbNavigate = (index: number) => {
    if (index === 0) {
      setSelectedTheme(null)
      setSelectedCluster(null)
    } else if (index === 1) {
      setSelectedCluster(null)
    }
  }

  const handleSaveTheme = (theme: Theme) => {
    setData((prev) => {
      const existingIndex = prev.themes.findIndex((t) => t.id === theme.id)
      if (existingIndex >= 0) {
        const newThemes = [...prev.themes]
        newThemes[existingIndex] = theme
        return { themes: newThemes }
      } else {
        return { themes: [...prev.themes, theme] }
      }
    })
    setEditingTheme(null)
  }

  const handleDeleteTheme = (themeId: string) => {
    setData((prev) => ({
      themes: prev.themes.filter((t) => t.id !== themeId)
    }))
    if (selectedTheme?.id === themeId) {
      setSelectedTheme(null)
      setSelectedCluster(null)
      setSelectedEntity(null)
    }
  }

  const handleSaveCluster = (cluster: Cluster, themeId: string) => {
    setData((prev) => {
      const newThemes = prev.themes.map((theme) => {
        if (theme.id === themeId) {
          const existingIndex = theme.clusters.findIndex((c) => c.id === cluster.id)
          let newClusters
          if (existingIndex >= 0) {
            // Update existing cluster
            newClusters = [...theme.clusters]
            newClusters[existingIndex] = cluster
          } else {
            // Add new cluster
            newClusters = [...theme.clusters, cluster]
          }
          return {
            ...theme,
            clusters: newClusters,
            clusterCount: newClusters.length
          }
        }
        return theme
      })
      return { themes: newThemes }
    })

    // Update selectedTheme if it's the one being edited
    if (selectedTheme?.id === themeId) {
      setSelectedTheme((prev) => {
        if (!prev) return null
        const existingIndex = prev.clusters.findIndex((c) => c.id === cluster.id)
        let newClusters
        if (existingIndex >= 0) {
          newClusters = [...prev.clusters]
          newClusters[existingIndex] = cluster
        } else {
          newClusters = [...prev.clusters, cluster]
        }
        return {
          ...prev,
          clusters: newClusters,
          clusterCount: newClusters.length
        }
      })
    }

    setEditingCluster(null)
  }

  const handleDeleteCluster = (themeId: string, clusterId: string) => {
    setData((prev) => {
      const newThemes = prev.themes.map((theme) => {
        if (theme.id === themeId) {
          const newClusters = theme.clusters.filter((c) => c.id !== clusterId)
          return {
            ...theme,
            clusters: newClusters,
            clusterCount: newClusters.length
          }
        }
        return theme
      })
      return { themes: newThemes }
    })

    // Update selectedTheme if it's the one being edited
    if (selectedTheme?.id === themeId) {
      setSelectedTheme((prev) => {
        if (!prev) return null
        const newClusters = prev.clusters.filter((c) => c.id !== clusterId)
        return {
          ...prev,
          clusters: newClusters,
          clusterCount: newClusters.length
        }
      })
    }

    // Clear selection if the deleted cluster was selected
    if (selectedCluster?.id === clusterId) {
      setSelectedCluster(null)
      setSelectedEntity(null)
    }
  }

  const handleSaveEntity = (entity: Entity, themeId: string, clusterId: string) => {
    setData((prev) => {
      const newThemes = prev.themes.map((theme) => {
        if (theme.id === themeId) {
          const newClusters = theme.clusters.map((cluster) => {
            if (cluster.id === clusterId) {
              const existingIndex = cluster.entities.findIndex((e) => e.id === entity.id)
              let newEntities
              if (existingIndex >= 0) {
                // Update existing entity
                newEntities = [...cluster.entities]
                newEntities[existingIndex] = entity
              } else {
                // Add new entity
                newEntities = [...cluster.entities, entity]
              }
              return {
                ...cluster,
                entities: newEntities,
                entityCount: newEntities.length
              }
            }
            return cluster
          })
          return { ...theme, clusters: newClusters }
        }
        return theme
      })
      return { themes: newThemes }
    })

    // Update selectedTheme and selectedCluster if they're the ones being edited
    if (selectedTheme?.id === themeId) {
      setSelectedTheme((prev) => {
        if (!prev) return null
        const newClusters = prev.clusters.map((cluster) => {
          if (cluster.id === clusterId) {
            const existingIndex = cluster.entities.findIndex((e) => e.id === entity.id)
            let newEntities
            if (existingIndex >= 0) {
              newEntities = [...cluster.entities]
              newEntities[existingIndex] = entity
            } else {
              newEntities = [...cluster.entities, entity]
            }
            return {
              ...cluster,
              entities: newEntities,
              entityCount: newEntities.length
            }
          }
          return cluster
        })
        return { ...prev, clusters: newClusters }
      })
    }

    if (selectedCluster?.id === clusterId) {
      setSelectedCluster((prev) => {
        if (!prev) return null
        const existingIndex = prev.entities.findIndex((e) => e.id === entity.id)
        let newEntities
        if (existingIndex >= 0) {
          newEntities = [...prev.entities]
          newEntities[existingIndex] = entity
        } else {
          newEntities = [...prev.entities, entity]
        }
        return {
          ...prev,
          entities: newEntities,
          entityCount: newEntities.length
        }
      })
    }

    setEditingEntity(null)
  }

  const handleDeleteEntity = (themeId: string, clusterId: string, entityId: string) => {
    setData((prev) => {
      const newThemes = prev.themes.map((theme) => {
        if (theme.id === themeId) {
          const newClusters = theme.clusters.map((cluster) => {
            if (cluster.id === clusterId) {
              const newEntities = cluster.entities.filter((e) => e.id !== entityId)
              return {
                ...cluster,
                entities: newEntities,
                entityCount: newEntities.length
              }
            }
            return cluster
          })
          return { ...theme, clusters: newClusters }
        }
        return theme
      })
      return { themes: newThemes }
    })

    // Update selectedTheme and selectedCluster if they're the ones being edited
    if (selectedTheme?.id === themeId) {
      setSelectedTheme((prev) => {
        if (!prev) return null
        const newClusters = prev.clusters.map((cluster) => {
          if (cluster.id === clusterId) {
            const newEntities = cluster.entities.filter((e) => e.id !== entityId)
            return {
              ...cluster,
              entities: newEntities,
              entityCount: newEntities.length
            }
          }
          return cluster
        })
        return { ...prev, clusters: newClusters }
      })
    }

    if (selectedCluster?.id === clusterId) {
      setSelectedCluster((prev) => {
        if (!prev) return null
        const newEntities = prev.entities.filter((e) => e.id !== entityId)
        return {
          ...prev,
          entities: newEntities,
          entityCount: newEntities.length
        }
      })
    }

    // Clear selection if the deleted entity was selected
    if (selectedEntity?.id === entityId) {
      setSelectedEntity(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-lg text-gray-600">Loading research data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-slate-50 to-zinc-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Research Synthesis Dashboard
              </h1>
              {lastSaved && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last saved: {lastSaved.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-1 sm:gap-2">
              {/* Export Operations */}
              <Button
                variant="ghost"
                size="sm"
                onClick={exportToJSON}
                title="Export data as JSON file"
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Export JSON</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportToPDF}
                title="Export as PDF report"
                className="gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setImportGuideOpen(true)}
                title="Import from JSON file"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileImport}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefault}
                title="Reset to default data"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <Button
                variant={editMode ? "default" : "outline"}
                onClick={() => setEditMode(!editMode)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
              </Button>
            </div>
          </div>
          {/* Search Bar */}
          <div className="mt-4">
            <SearchBar themes={data.themes} onResultClick={handleSearchResultClick} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12">
        <Breadcrumb 
          path={getBreadcrumbPath()} 
          onNavigate={handleBreadcrumbNavigate}
        />

        {/* Level 1: Themes View */}
        {!selectedTheme && (
          <div>
            <div className="mb-8">
              <p className="text-lg text-gray-600">
                Strategic insights synthesized from {data.themes.length} research themes.
                Click any theme to explore clusters and supporting evidence.
              </p>
            </div>
            
            <div className="grid gap-fluid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
              {data.themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  onClick={() => setSelectedTheme(theme)}
                  editMode={editMode}
                  onEdit={() => setEditingTheme(theme)}
                  onDelete={() => handleDeleteTheme(theme.id)}
                />
              ))}
            </div>

            {editMode && (
              <Button
                onClick={() => setEditingTheme({
                  id: `t${Date.now()}`,
                  title: '',
                  description: '',
                  sources: [],
                  clusterCount: 0,
                  color: 'blue',
                  clusters: []
                })}
                className="mt-8 gap-2"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add New Theme
              </Button>
            )}
          </div>
        )}

        {/* Level 2: Clusters View */}
        {selectedTheme && !selectedCluster && (
          <div>
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedTheme(null)}
                className="mb-4 gap-2 -ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to themes
              </Button>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedTheme.title}
              </h2>
              <p className="text-base text-gray-600">
                {selectedTheme.description}
              </p>
            </div>
            <div
              className="grid gap-4 md:gap-5 lg:gap-6"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}
            >
              {selectedTheme.clusters.map((cluster) => (
                <ClusterCard
                  key={cluster.id}
                  cluster={cluster}
                  onClick={() => setSelectedCluster(cluster)}
                  editMode={editMode}
                  onEdit={() => setEditingCluster({ cluster, themeId: selectedTheme.id })}
                  onDelete={() => handleDeleteCluster(selectedTheme.id, cluster.id)}
                />
              ))}
            </div>

            {editMode && selectedTheme && (
              <Button
                onClick={() => setEditingCluster({
                  cluster: {
                    id: `c${Date.now()}`,
                    name: '',
                    summary: '',
                    entityCount: 0,
                    entities: []
                  },
                  themeId: selectedTheme.id
                })}
                className="mt-8 gap-2"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add New Cluster
              </Button>
            )}
          </div>
        )}

        {/* Level 3: Entities View */}
        {selectedTheme && selectedCluster && (
          <div>
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedCluster(null)}
                className="mb-4 gap-2 -ml-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to clusters
              </Button>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                {selectedCluster.name}
              </h3>
              <p className="text-base text-gray-600 mb-6">
                {selectedCluster.summary}
              </p>
              <div className="text-sm text-gray-500">
                {selectedCluster.entityCount} discrete entities from user research
              </div>
            </div>
            <div className="space-y-4">
              {selectedCluster.entities.map((entity) => (
                <EntityItem
                  key={entity.id}
                  entity={entity}
                  onClick={() => setSelectedEntity(entity)}
                  editMode={editMode}
                  onEdit={() => setEditingEntity({
                    entity,
                    themeId: selectedTheme!.id,
                    clusterId: selectedCluster.id
                  })}
                  onDelete={() => handleDeleteEntity(
                    selectedTheme!.id,
                    selectedCluster.id,
                    entity.id
                  )}
                />
              ))}
            </div>

            {editMode && selectedTheme && selectedCluster && (
              <Button
                onClick={() => setEditingEntity({
                  entity: {
                    id: `e${Date.now()}`,
                    statement: '',
                    type: 'jtbd',
                    pains: [],
                    gains: [],
                    source: '',
                    transcriptId: '',
                    participantId: '',
                    timestamp: '',
                    date: '',
                    verbatimQuote: '',
                    context: ''
                  },
                  themeId: selectedTheme.id,
                  clusterId: selectedCluster.id
                })}
                className="mt-8 gap-2"
                size="lg"
              >
                <Plus className="w-5 h-5" />
                Add New Entity
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Source Modal (Level 4: Raw Data) */}
      {selectedEntity && (
        <SourceModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}

      {/* Edit Theme Dialog */}
      {editingTheme && (
        <EditThemeDialog
          theme={editingTheme}
          open={!!editingTheme}
          onOpenChange={(open) => !open && setEditingTheme(null)}
          onSave={handleSaveTheme}
        />
      )}

      {/* Import Guide Modal */}
      <ImportGuideModal
        open={importGuideOpen}
        onOpenChange={setImportGuideOpen}
        onImportClick={() => fileInputRef.current?.click()}
      />

      {/* Edit Cluster Dialog */}
      {editingCluster && (
        <EditClusterDialog
          cluster={editingCluster.cluster}
          themeId={editingCluster.themeId}
          open={!!editingCluster}
          onOpenChange={(open) => !open && setEditingCluster(null)}
          onSave={handleSaveCluster}
        />
      )}

      {/* Edit Entity Dialog */}
      {editingEntity && (
        <EditEntityDialog
          entity={editingEntity.entity}
          themeId={editingEntity.themeId}
          clusterId={editingEntity.clusterId}
          open={!!editingEntity}
          onOpenChange={(open) => !open && setEditingEntity(null)}
          onSave={handleSaveEntity}
        />
      )}
    </div>
  )
}
