
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  // Redirect to dashboard if not an admin
  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  // Render children if authenticated and admin
  return children;
};

export default AdminRoute;
