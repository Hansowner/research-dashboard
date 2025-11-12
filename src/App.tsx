import { ThemeProvider } from './components/theme-provider'
import { ErrorBoundary } from './components/ErrorBoundary'
import ResearchDashboard from './components/ResearchDashboard'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="research-dashboard-theme">
        <ResearchDashboard />
        <Toaster position="bottom-right" richColors />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
