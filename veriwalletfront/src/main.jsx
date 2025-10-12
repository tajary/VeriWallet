import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'
import { StorageProvider } from './contexts/StorageContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <StorageProvider>
        <App />
      </StorageProvider>
    </AuthProvider>
  </React.StrictMode>,
)