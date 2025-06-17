import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AdminAuthSelector from '../Selectors/AdminAuthSelector';
import { useSelector } from 'react-redux';

const AdminProtected = () => {
    
    
    const isAdminAuthenticated = useSelector(AdminAuthSelector.isAdmin); // Replace with your actual auth check
    const location = useLocation();
    
    // Allow access to login page when not authenticated
    if (!isAdminAuthenticated && location.pathname === '/admin/login') {
        return <Outlet />;
    }

    // Redirect to login if trying to access protected routes while not authenticated
    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    // Redirect to admin dashboard if trying to access login while authenticated
    if (isAdminAuthenticated && location.pathname === '/admin/login') {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default AdminProtected;