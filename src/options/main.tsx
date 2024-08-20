import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/globals.css'
import App from '@/options/app'

const root = document.getElementById('root')

if (!root) throw new Error('root element not found.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
