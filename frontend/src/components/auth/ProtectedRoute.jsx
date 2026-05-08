import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children}) => {
    // Lấy biến isAuthenticated từ store
    const { isAuthenticated } = useAuthStore();

    // Nếu đã đăng nhập -> cho phép vào trang
    if(isAuthenticated){
        return children;
    }

    // Nếu chưa đăng nhập -> quay về login
    return <Navigate to="/login"/>
}

export default ProtectedRoute;