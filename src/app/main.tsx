import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Page } from '@airiot/client'
import { BrowserRouter } from 'react-router-dom'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Page>
        <App />
      </Page>
    </BrowserRouter>
  </React.StrictMode>,
)
