import { ChevronRight } from 'lucide-react'

interface BreadcrumbProps {
  path: string[]
  onNavigate: (index: number) => void
}

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-500 mb-8">
      <ol className="flex items-center flex-wrap gap-2">
        {path.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            )}
            {index < path.length - 1 ? (
              <button
                onClick={() => onNavigate(index)}
                className="hover:text-gray-900 transition-colors"
              >
                {item}
              </button>
            ) : (
              <span className="text-gray-900 font-medium">{item}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
