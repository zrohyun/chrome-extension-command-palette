import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/globals.css'
import App from '@/settings/app'

const root = document.getElementById('root')

if (!root) throw new Error('root element not found.')

chrome.storage.sync
  .get({ theme: 'system' })
  .then(({ theme }) => {
    createRoot(root).render(
      <StrictMode>
        <App theme={theme} />
      </StrictMode>
    )
  })
  .catch(console.error)
