import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import globalStyle from '@/globals.css?inline'
import contentStyle from '@/content/style.scss?inline'
import Wrapper from '@/content/wrapper'

const shadowHost = document.createElement('div')
const shadowRoot = shadowHost.attachShadow({ mode: 'open' })

const resetStyle = '*:host { all: initial !important; }'

createRoot(shadowRoot).render(
  <StrictMode>
    <style>{resetStyle}</style>
    <style>{globalStyle}</style>
    <style>{contentStyle}</style>
    <Wrapper />
  </StrictMode>
)

shadowHost.id = 'chrome-extension-command-palette'
document.body.appendChild(shadowHost)
