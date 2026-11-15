import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Registra el Service Worker per a funcionalitats PWA (offline + instal·lació)
registerSW({ immediate: true })

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No s’ha trobat l’element arrel de l’aplicació.')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
