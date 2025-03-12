import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BotDetails from './pages/BotDetails';
import Help from './pages/Help';
import CreateBot from './pages/CreateBot';
import EditBot from './pages/EditBot';
import Forum from './pages/Forum';
import PostDetails from './pages/PostDetails';
import CreatePost from './pages/CreatePost';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ReportedContent from './pages/admin/ReportedContent';
import SystemStatus from './pages/admin/SystemStatus';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/help" element={<Help />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile/:userId" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bot/:botId" 
          element={
            <ProtectedRoute>
              <BotDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-bot" 
          element={
            <ProtectedRoute>
              <CreateBot />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-bot/:botId" 
          element={
            <ProtectedRoute>
              <EditBot />
            </ProtectedRoute>
          } 
        />
        <Route path="/forum" element={<Forum />} />
        <Route path="/forum/category/:category" element={<Forum />} />
        <Route path="/forum/post/:postId" element={<PostDetails />} />
        <Route 
          path="/forum/create" 
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <AdminRoute>
              <ReportedContent />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/system" 
          element={
            <AdminRoute>
              <SystemStatus />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
}

export default App;