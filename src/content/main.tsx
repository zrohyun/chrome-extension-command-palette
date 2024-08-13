import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import globalStyle from '@/globals.css?inline'
import contentStyle from '@/content/style.scss?inline'
import App from '@/content/app'

const shadowHost = document.createElement('div')
const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

const resetStyle = '*:host { all: initial !important; }'

chrome.storage.sync
  .get({ theme: 'system' })
  .then(({ theme }) => {
    createRoot(shadowRoot).render(
      <StrictMode>
        <style>{resetStyle}</style>
        <style>{globalStyle}</style>
        <style>{contentStyle}</style>
        <App theme={theme} />
      </StrictMode>
    )

    shadowHost.id = 'chrome-extension-command-palette'
    document.body.appendChild(shadowHost)
  })
  .catch(console.error)
