import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import globalStyle from '@/globals.css?inline'
import App from '@/content/app'

const shadowHost = document.createElement('div')
const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

const resetStyle = '*:host { all: initial !important; }'

createRoot(shadowRoot).render(
  <StrictMode>
    <style>{resetStyle}</style>
    <style>{globalStyle}</style>
    <App />
  </StrictMode>
)

shadowHost.id = 'chrome-extension-command-palette'
document.body.appendChild(shadowHost)
