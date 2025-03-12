import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import axios from 'axios';
import { lightTheme, darkTheme } from './styles/themes';
import GlobalStyles from './styles/GlobalStyles';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateBot from './pages/CreateBot';
import BotDetails from './pages/BotDetails';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import ForumPost from './pages/ForumPost';
import CreateForumPost from './pages/CreateForumPost';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';


const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  axios.defaults.withCredentials = true;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/auth/check');
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <ErrorBoundary>
          <Navbar 
            isAuthenticated={isAuthenticated} 
            setIsAuthenticated={setIsAuthenticated}
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/help" element={<Help />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/post/:id" element={<ForumPost />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Dashboard user={user} />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            } />
            <Route path="/create-bot" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <CreateBot user={user} />
              </ProtectedRoute>
            } />
            <Route path="/bot/:id" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <BotDetails user={user} />
              </ProtectedRoute>
            } />
            <Route path="/forum/create" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
                <CreateForumPost user={user} />
              </ProtectedRoute>
            } />


            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated} 
                isLoading={isLoading}
                requiredRole={['admin']}
              >
                <AdminDashboard user={user} />
              </ProtectedRoute>
            } />

            {/* 404 page */}
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Added Navigate for 404 */}
          </Routes>
          <Footer />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;
import { ParallaxProvider } from 'react-scroll-parallax';
import ThemeProvider from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import GlobalStyle from './styles/GlobalStyle';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BotCreator from './pages/BotCreator';
import BotManager from './pages/BotManager';
import Forum from './pages/Forum';
import ForumTopic from './pages/ForumTopic';
import ForumPost from './pages/ForumPost';
import Profile from './pages/Profile';
import Help from './pages/Help';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ReportedContent from './pages/admin/ReportedContent';
import SystemSettings from './pages/admin/SystemSettings';

// Auth components
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ParallaxProvider>
          <Router>
            <GlobalStyle />
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/help" element={<Help />} />

              {/* Private routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/bot-creator" element={<PrivateRoute><BotCreator /></PrivateRoute>} />
              <Route path="/bot-manager" element={<PrivateRoute><BotManager /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

              {/* Forum routes */}
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/topic/:topicId" element={<ForumTopic />} />
              <Route path="/forum/post/:postId" element={<ForumPost />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
              <Route path="/admin/reports" element={<AdminRoute><ReportedContent /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><SystemSettings /></AdminRoute>} />

              {/* 404 route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </Router>
        </ParallaxProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;