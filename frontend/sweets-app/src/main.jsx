import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom';
import { SweetsProvider } from './context/SweetsContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SweetsProvider>
          <App />
        </SweetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
