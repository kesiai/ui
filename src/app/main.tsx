import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Page } from '@kesi/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "@/components/ui/sonner"
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Page>
      <App />
      <Toaster />
    </Page>
  </BrowserRouter>
)
