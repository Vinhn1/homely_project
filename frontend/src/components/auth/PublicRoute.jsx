import { useAuthStore } from "@/store/useAuthStore";
import { Navigate } from 'react-router-dom';

const PublicRoute = ({children}) => {
    
    const { isAuthenticated } = useAuthStore();

    // Nếu đã đăng nhập -> cho vào trang chủ
    if(isAuthenticated){
        return <Navigate to="/"/>
    }

    // Nếu chưa đăng nhập -> vào trang public
    return children;
}

export default PublicRoute;