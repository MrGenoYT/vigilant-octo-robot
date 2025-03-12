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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
};

export default App;