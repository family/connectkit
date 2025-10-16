import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { OpenfortProviders } from './integrations/openfort';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <OpenfortProviders>
      <App />
    </OpenfortProviders>
  </StrictMode>
);
