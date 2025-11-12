import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Font } from '@react-pdf/renderer'
import './index.css'
import App from './App.tsx'

// Configure PDF rendering globally - disable hyphenation to prevent mid-word breaks
Font.registerHyphenationCallback(word => [word])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
