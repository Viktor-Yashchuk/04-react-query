import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App'
import 'modern-normalize'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <StrictMode>
    <App />
    <Toaster position='top-center' />
  </StrictMode>,
);
