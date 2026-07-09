import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // <-- Ajout de l'import du Provider
import { store } from './store/store.js' // <-- Ajout de l'import de ton store global
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* On enveloppe toute l'application avec le Provider pour rendre le store accessible */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)