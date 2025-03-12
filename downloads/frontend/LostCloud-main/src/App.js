
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ParallaxProvider } from 'react-scroll-parallax';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BotConfig = lazy(() => import('./pages/BotConfig'));
const Forum = lazy(() => import('./pages/Forum'));
const ForumPost = lazy(() => import('./pages/ForumPost'));
const CreateForumPost = lazy(() => import('./pages/CreateForumPost'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ParallaxProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/bots/:id/config" 
                      element={
                        <ProtectedRoute>
                          <BotConfig />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/forum" 
                      element={
                        <ProtectedRoute>
                          <Forum />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/forum/post/:id" 
                      element={
                        <ProtectedRoute>
                          <ForumPost />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/forum/create" 
                      element={
                        <ProtectedRoute>
                          <CreateForumPost />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin routes */}
                    <Route 
                      path="/admin/*" 
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Fallback routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </ParallaxProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
