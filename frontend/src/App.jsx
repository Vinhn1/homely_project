import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import HomePage from './components/page/HomePage'
import LoginPage from './components/page/LoginPage'
import RegisterPage from './components/page/RegisterPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import PublicRoute from './components/auth/PublicRoute'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ListPropertyPage from './components/page/ListPropertyPage'
import PropertyDetailsPage from './components/page/PropertyDetailsPage'
import SearchListingPage from './components/page/SearchListingPage'
import ProfilePage from './components/page/ProfilePage'
import NewsPage from './components/page/NewsPage'
import GuidePage from './components/page/GuidePage'
import WishlistPage from './components/page/WishlistPage'
import ChatPage from './components/page/ChatPage'
import NotificationPage from './components/page/NotificationPage'
import AdminPage from './components/page/AdminPage'
import AdminRoute from './components/auth/AdminRoute'
import SocketProvider from './components/shared/SocketProvider'

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
    <>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <SocketProvider>
          <Routes>
            {/* Trang chủ ai cũng có thể xem */}
            <Route path="/" element={<HomePage />} />

            {/* Bọc những trang mà người dùng đã login không được vào lại */}
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

            <Route path="/dang-tin" element={
              <ProtectedRoute>
                <ListPropertyPage />
              </ProtectedRoute>
            } />

            <Route path="/edit-property/:id" element={
              <ProtectedRoute>
                <ListPropertyPage />
              </ProtectedRoute>
            } />

            <Route path="/tim-phong" element={<SearchListingPage />} />
            <Route path="/tin-tuc" element={<NewsPage />} />
            <Route path="/huong-dan" element={<GuidePage />} />

            {/* Trang chi tiết: công khai, ai cũng xem được */}
            <Route path="/property/:id" element={<PropertyDetailsPage />} />

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            } />
            <Route path="/tin-nhan" element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } />
            <Route path="/thong-bao" element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </>
  )
}

export default App
