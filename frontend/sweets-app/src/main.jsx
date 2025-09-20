import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom';
import { SweetsProvider } from './context/SweetsContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* client side routing */}
    <BrowserRouter> 
    {/* AuthProvider provides authentication context to the app */}
      <AuthProvider>
        {/* SweetsProvider provides sweets data and action context */}
        <SweetsProvider>
          {/* main application component */}
          <App />
        </SweetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
