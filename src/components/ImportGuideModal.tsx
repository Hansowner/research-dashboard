import { useState } from 'react'
import { Download, Copy, CheckCircle, AlertTriangle, FileJson, Book, Database, CheckSquare, AlertCircle, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Textarea } from './ui/textarea'
import { downloadTemplate, getTemplateAsString } from '../utils/templateGenerator'
import { validateJSON, getValidationSummary, type ValidationResult } from '../utils/jsonValidator'
import { toast } from 'sonner'

interface ImportGuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportClick: () => void
}

export default function ImportGuideModal({ open, onOpenChange, onImportClick }: ImportGuideModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [validationInput, setValidationInput] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const handleDownload = (type: 'minimal' | 'example' | 'full') => {
    downloadTemplate(type)
    toast.success('Template downloaded successfully')
  }

  const handleValidate = () => {
    if (!validationInput.trim()) {
      toast.error('Please paste JSON to validate')
      return
    }
    const result = validateJSON(validationInput)
    setValidationResult(result)
  }

  const handleImportFile = () => {
    onOpenChange(false)
    setTimeout(() => onImportClick(), 100)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex items-center gap-3">
            <FileJson className="w-8 h-8 text-blue-600" />
            Import Data Guide
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <Book className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="structure" className="gap-2">
              <Database className="w-4 h-4" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <Download className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="validator" className="gap-2">
              <CheckSquare className="w-4 h-4" />
              Validator
            </TabsTrigger>
            <TabsTrigger value="help" className="gap-2">
              <AlertCircle className="w-4 h-4" />
              Help
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">Quick Start Guide</h3>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <h4 className="font-semibold">Download a Template</h4>
                    <p className="text-sm text-gray-700">Go to the Templates tab and download a starter file</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <h4 className="font-semibold">Fill in Your Data</h4>
                    <p className="text-sm text-gray-700">Edit the JSON file with your research findings</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <h4 className="font-semibold">Validate (Optional)</h4>
                    <p className="text-sm text-gray-700">Use the Validator tab to check your data before importing</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <h4 className="font-semibold">Import Your File</h4>
                    <p className="text-sm text-gray-700">Click the "Import My File" button below</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">What You Can Import</h3>
              <p className="text-gray-700 mb-4">
                This dashboard accepts JSON files containing research data organized into <strong>Themes</strong>, <strong>Clusters</strong>, and <strong>Entities</strong>.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>User research findings and insights</li>
                <li>Jobs-to-be-Done (JTBD) statements</li>
                <li>Pain points and gains from user interviews</li>
                <li>Atomic facts from research sessions</li>
                <li>Verbatim quotes with context</li>
              </ul>
            </div>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Data Hierarchy</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <pre className="text-sm">
{`📊 Data Root
  └─ 🎯 Themes (array) - High-level research themes
       ├─ id, title, description
       ├─ sources[], color, clusterCount
       └─ 📂 Clusters (array) - Grouped findings
            ├─ id, name, summary, entityCount
            └─ 📄 Entities (array) - Individual insights
                 ├─ id, statement, type
                 ├─ source, transcript, participant
                 ├─ timestamp, date
                 ├─ verbatimQuote, context
                 └─ pains[], gains[] (optional)`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Field Reference</h3>
              <div className="space-y-4">
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Theme Fields</summary>
                  <table className="w-full mt-3 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Field</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Required</th>
                        <th className="text-left py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2 font-mono">id</td><td>string</td><td>✓</td><td>Unique identifier</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">title</td><td>string</td><td>✓</td><td>Theme title</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">description</td><td>string</td><td>✓</td><td>Theme description</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">sources</td><td>string[]</td><td>✓</td><td>Data source types</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">clusterCount</td><td>number</td><td>✓</td><td>Number of clusters</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">color</td><td>string</td><td>✓</td><td>blue | green | amber | purple | rose | cyan</td></tr>
                      <tr><td className="py-2 font-mono">clusters</td><td>array</td><td>✓</td><td>Array of cluster objects</td></tr>
                    </tbody>
                  </table>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Cluster Fields</summary>
                  <table className="w-full mt-3 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Field</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2 font-mono">id</td><td>string</td><td>✓</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">name</td><td>string</td><td>✓</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">summary</td><td>string</td><td>✓</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">entityCount</td><td>number</td><td>✓</td></tr>
                      <tr><td className="py-2 font-mono">entities</td><td>array</td><td>✓</td></tr>
                    </tbody>
                  </table>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Entity Fields</summary>
                  <table className="w-full mt-3 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Field</th>
                        <th className="text-left py-2">Type</th>
                        <th className="text-left py-2">Required</th>
                        <th className="text-left py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b"><td className="py-2 font-mono">id</td><td>string</td><td>✓</td><td></td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">statement</td><td>string</td><td>✓</td><td>Main insight</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">type</td><td>string</td><td>✓</td><td>jtbd | fact | pain | gain</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">pains</td><td>string[]</td><td></td><td>Optional</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">gains</td><td>string[]</td><td></td><td>Optional</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">source</td><td>string</td><td>✓</td><td>e.g., "Interview #47"</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">transcriptId</td><td>string</td><td>✓</td><td></td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">participantId</td><td>string</td><td>✓</td><td></td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">timestamp</td><td>string</td><td>✓</td><td>e.g., "31:42"</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">date</td><td>string</td><td>✓</td><td>e.g., "Nov 8, 2024"</td></tr>
                      <tr className="border-b"><td className="py-2 font-mono">verbatimQuote</td><td>string</td><td>✓</td><td>Exact participant words</td></tr>
                      <tr><td className="py-2 font-mono">context</td><td>string</td><td>✓</td><td>Question/context</td></tr>
                    </tbody>
                  </table>
                </details>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <p className="text-gray-700">Download a pre-configured template to get started quickly:</p>

            <div className="grid gap-4">
              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">Minimal Template</h4>
                    <p className="text-sm text-gray-600">Empty structure with 1 theme, 1 cluster, 1 entity</p>
                  </div>
                  <Button onClick={() => handleDownload('minimal')} size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                <div className="bg-gray-50 rounded p-3 text-xs font-mono overflow-x-auto">
                  <pre>{getTemplateAsString('minimal').slice(0, 200)}...</pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={() => handleCopy(getTemplateAsString('minimal'), 'Minimal template')}
                >
                  <Copy className="w-3 h-3" />
                  Copy to clipboard
                </Button>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">Example Template</h4>
                    <p className="text-sm text-gray-600">Sample data showing all field types</p>
                  </div>
                  <Button onClick={() => handleDownload('example')} size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                <div className="bg-gray-50 rounded p-3 text-xs font-mono overflow-x-auto">
                  <pre>{getTemplateAsString('example').slice(0, 200)}...</pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={() => handleCopy(getTemplateAsString('example'), 'Example template')}
                >
                  <Copy className="w-3 h-3" />
                  Copy to clipboard
                </Button>
              </div>

              <div className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">Full Template</h4>
                    <p className="text-sm text-gray-600">Complete example with multiple themes</p>
                  </div>
                  <Button onClick={() => handleDownload('full')} size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                <div className="bg-gray-50 rounded p-3 text-xs font-mono overflow-x-auto">
                  <pre>{getTemplateAsString('full').slice(0, 200)}...</pre>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-2"
                  onClick={() => handleCopy(getTemplateAsString('full'), 'Full template')}
                >
                  <Copy className="w-3 h-3" />
                  Copy to clipboard
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Validator Tab */}
          <TabsContent value="validator" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Validate Your JSON</h3>
              <p className="text-sm text-gray-600 mb-4">
                Paste your JSON data below to check for errors before importing
              </p>
            </div>

            <Textarea
              placeholder="Paste your JSON here..."
              value={validationInput}
              onChange={(e) => setValidationInput(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />

            <Button onClick={handleValidate} className="w-full gap-2">
              <CheckSquare className="w-4 h-4" />
              Validate JSON
            </Button>

            {validationResult && (
              <div className={`border rounded-lg p-4 ${validationResult.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  {validationResult.isValid ? (
                    <><CheckCircle className="w-5 h-5 text-green-600" /> Validation Passed</>
                  ) : (
                    <><AlertTriangle className="w-5 h-5 text-red-600" /> Validation Failed</>
                  )}
                </h4>
                <p className="text-sm mb-3">{getValidationSummary(validationResult)}</p>

                {validationResult.errors.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-sm text-red-900">Errors:</h5>
                    {validationResult.errors.map((error, idx) => (
                      <div key={idx} className="bg-white rounded p-2 text-sm">
                        <p className="font-mono text-xs text-red-700">{error.path || error.field}</p>
                        <p className="text-gray-800">{error.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <h5 className="font-semibold text-sm text-yellow-900">Warnings:</h5>
                    {validationResult.warnings.map((warning, idx) => (
                      <div key={idx} className="bg-white rounded p-2 text-sm">
                        <p className="font-mono text-xs text-yellow-700">{warning.path || warning.field}</p>
                        <p className="text-gray-800">{warning.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Common Issues</h3>

              <div className="space-y-4">
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Invalid JSON syntax</summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Make sure your JSON is properly formatted. Common issues include:
                    <ul className="list-disc list-inside mt-2 ml-4">
                      <li>Missing commas between properties</li>
                      <li>Trailing commas after the last item</li>
                      <li>Unquoted property names</li>
                      <li>Single quotes instead of double quotes</li>
                    </ul>
                  </p>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Wrong entity type values</summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Entity type must be exactly one of: <code className="bg-gray-100 px-1">jtbd</code>, <code className="bg-gray-100 px-1">fact</code>, <code className="bg-gray-100 px-1">pain</code>, or <code className="bg-gray-100 px-1">gain</code>
                  </p>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Wrong theme color values</summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Theme color must be exactly one of: <code className="bg-gray-100 px-1">blue</code>, <code className="bg-gray-100 px-1">green</code>, <code className="bg-gray-100 px-1">amber</code>, <code className="bg-gray-100 px-1">purple</code>, <code className="bg-gray-100 px-1">rose</code>, or <code className="bg-gray-100 px-1">cyan</code>
                  </p>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Duplicate IDs</summary>
                  <p className="mt-2 text-sm text-gray-700">
                    Each ID must be unique within its scope (all theme IDs unique, all cluster IDs unique within a theme, all entity IDs unique within a cluster).
                  </p>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">Count mismatches</summary>
                  <p className="mt-2 text-sm text-gray-700">
                    The <code className="bg-gray-100 px-1">clusterCount</code> should equal the length of the <code className="bg-gray-100 px-1">clusters</code> array.
                    The <code className="bg-gray-100 px-1">entityCount</code> should equal the length of the <code className="bg-gray-100 px-1">entities</code> array.
                  </p>
                </details>
              </div>
            </div>

            <div className="bg-gray-50 border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Need More Help?</h4>
              <p className="text-sm text-gray-700">
                Download a template from the Templates tab and use it as a starting point.
                Use the Validator tab to check your data before importing.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImportFile} size="lg" className="gap-2">
            <Upload className="w-5 h-5" />
            Import My File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
