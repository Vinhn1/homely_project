import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children}) => {
    // Lấy biến isAuthenticated từ store
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();

    // Nếu đã đăng nhập -> cho phép vào trang
    if(isAuthenticated){
        return children;
    }

    // Nếu chưa đăng nhập -> quay về login, lưu lại trang đang định vào
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
}

export default ProtectedRoute;