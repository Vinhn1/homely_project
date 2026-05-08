import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/page/HomePage'
import LoginPage from './components/page/LoginPage'
import RegisterPage from './components/page/RegisterPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'

function App() {
    
  const { checkAuth, isCheckingAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();

  }, [checkAuth]);

  
    if(isCheckingAuth)
      return <div>
        Loading...
      </div>


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
