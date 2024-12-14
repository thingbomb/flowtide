import * as React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './components/ui/theme-provider.jsx'
import { Toaster } from './components/ui/sonner.jsx'

const root = document.getElementById('root') as HTMLElement

createRoot(root).render(
  <StrictMode>
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <App />
      <Toaster />
    </ThemeProvider>
  </StrictMode>
)
