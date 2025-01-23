import Navbar from './components/navbar'
import { Outlet } from 'react-router-dom'
import './App.css'

export default function App() {
  console.log(`Using environment: ${import.meta.env.VITE_ENVIRONMENT}`)
  console.log(`Using API URL: ${import.meta.env.VITE_TASK_MANAGEMENT_API_URL}`)

  return (
    <div>    
      <Navbar />
      <Outlet />
    </div>
  )
}