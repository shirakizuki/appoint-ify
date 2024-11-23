import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'

// ... IMPORT CSS STYLINGS
import './index.css'

// ... IMPORT COMPONENTS
import App from './App.jsx'
import ServerContextProvider from './context/ServerContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ServerContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ServerContextProvider>
  </BrowserRouter>,
)
