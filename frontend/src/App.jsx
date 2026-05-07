import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/page/HomePage'
import LoginPage from './components/page/LoginPage'
import RegisterPage from './components/page/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
