import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { OpenfortProviders } from './integrations/openfort'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OpenfortProviders>
      <App />
    </OpenfortProviders>
  </StrictMode>,
)
