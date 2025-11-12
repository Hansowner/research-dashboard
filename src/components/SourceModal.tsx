import { X, ExternalLink } from 'lucide-react'
import type { Entity } from '../types'

interface SourceModalProps {
  entity: Entity | null
  onClose: () => void
}

export default function SourceModal({ entity, onClose }: SourceModalProps) {
  if (!entity) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 md:px-8 py-6 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">Source Evidence</h3>
            <p className="text-sm text-gray-500 mt-1">Traced from raw transcript data</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-8">
          {/* Entity Statement */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Synthesized Entity</h4>
            <p className="text-base text-gray-700 leading-relaxed">
              {entity.statement}
            </p>
          </div>

          {/* Verbatim Quote */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Original Quote</h4>
            <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r">
              <p className="text-gray-800 italic font-mono text-sm leading-relaxed">
                "{entity.verbatimQuote}"
              </p>
            </blockquote>
          </div>

          {/* Context */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Interview Context</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {entity.context}
            </p>
          </div>

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
              Metadata
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Participant:</span>
                <span className="text-gray-900 font-medium">{entity.participantId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transcript ID:</span>
                <span className="text-gray-900 font-medium">{entity.transcriptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span className="text-gray-900 font-medium">{entity.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interview Date:</span>
                <span className="text-gray-900 font-medium">{entity.date}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                <ExternalLink className="w-4 h-4" />
                View full transcript
              </button>
            </div>

            {/* AI extraction indicator */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">
                  AI-extracted
                </span>
                <span>Entity synthesized using GPT-4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
