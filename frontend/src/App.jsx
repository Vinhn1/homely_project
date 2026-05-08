import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './components/page/HomePage'
import LoginPage from './components/page/LoginPage'
import RegisterPage from './components/page/RegisterPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import PublicRoute from './components/auth/PublicRoute'

function App() {

  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();

  }, [checkAuth]);


  // 2. Nếu đang trong quá trình kiểm tra, hãy hiển thị màn hình chờ
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1565C0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ ai cũng có thể xem không cần bọc */}
        <Route path="/" element={<HomePage />} />

        {/* Bọc nhũng trang mà người dùng đã login không được vào lại */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />


        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
