import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Home from './pages/Home/Home'
import About from './pages/About/About'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          {/* Add more routes here if needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
