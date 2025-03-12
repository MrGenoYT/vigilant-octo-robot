
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ParallaxProvider } from 'react-scroll-parallax';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BotManager from './pages/BotManager';
import BotDetail from './pages/BotDetail';
import CreateBot from './pages/CreateBot';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ReportedContent from './pages/admin/ReportedContent';
import SystemLogs from './pages/admin/SystemLogs';

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  const location = useLocation();
  const [showNavFooter, setShowNavFooter] = useState(true);
  
  useEffect(() => {
    // Don't show navbar/footer on login and register pages
    const noNavFooterRoutes = ['/login', '/register'];
    setShowNavFooter(!noNavFooterRoutes.includes(location.pathname));
  }, [location]);
  
  return (
    <ParallaxProvider>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            {showNavFooter && <Navbar />}
            <main className="main-content">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/help" element={<Help />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/bots" element={
                  <ProtectedRoute>
                    <BotManager />
                  </ProtectedRoute>
                } />
                <Route path="/bots/create" element={
                  <ProtectedRoute>
                    <CreateBot />
                  </ProtectedRoute>
                } />
                <Route path="/bots/:id" element={
                  <ProtectedRoute>
                    <BotDetail />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute requiredRole="admin">
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                  <ProtectedRoute requiredRole="admin">
                    <ReportedContent />
                  </ProtectedRoute>
                } />
                <Route path="/admin/logs" element={
                  <ProtectedRoute requiredRole="admin">
                    <SystemLogs />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {showNavFooter && <Footer />}
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ParallaxProvider>
  );
}

export default App;
