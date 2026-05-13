import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return null;

    if (!isAuthenticated || user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
