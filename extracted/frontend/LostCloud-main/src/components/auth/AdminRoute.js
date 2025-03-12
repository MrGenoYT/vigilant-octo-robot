
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user || !user.isAdmin) {
    // Redirect to dashboard if logged in but not admin, or to login if not authenticated
    const redirectTo = isAuthenticated ? '/dashboard' : '/login';
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
