import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './page/HomePage'
import CustomizeCarPage from './page/CustomizeCarPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/customize" element={<CustomizeCarPage />} />
      </Routes>
    </Router>
  )
}

export default App
