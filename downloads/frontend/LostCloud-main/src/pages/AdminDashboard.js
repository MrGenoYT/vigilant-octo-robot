
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaUsers, FaRobot, FaComments, FaChartLine, FaUserShield, FaFlag } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

// Sub-pages
const UsersManagement = React.lazy(() => import('./admin/UsersManagement'));
const BotsManagement = React.lazy(() => import('./admin/BotsManagement'));
const ForumManagement = React.lazy(() => import('./admin/ForumManagement'));
const Statistics = React.lazy(() => import('./admin/Statistics'));
const ReportedContent = React.lazy(() => import('./admin/ReportedContent'));

const AdminContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 120px);
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: ${props => props.theme.cardBackground};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  
  @media (max-width: 768px) {
    width: 70px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${props => props.theme.background};
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
  
  @media (max-width: 768px) {
    padding: 0 10px 20px;
    display: flex;
    justify-content: center;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.2rem;
  color: ${props => props.theme.primary};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarLogo = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    font-size: 1.5rem;
    color: ${props => props.theme.primary};
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${props => props.active ? props.theme.primary : props.theme.textPrimary};
  background-color: ${props => props.active ? props.theme.activeNavBackground : 'transparent'};
  border-left: 4px solid ${props => props.active ? props.theme.primary : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.hoverBackground};
    color: ${props => props.active ? props.theme.primary : props.theme.textPrimary};
  }
  
  @media (max-width: 768px) {
    padding: 15px 0;
    justify-content: center;
    border-left: none;
    border-bottom: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  }
`;

const NavIcon = styled.div`
  margin-right: 12px;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    font-size: 1.5rem;
  }
`;

const NavText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 25px;
`;

const PageTitle = styled(motion.h1)`
  font-size: 2rem;
  margin-bottom: 10px;
  color: ${props => props.theme.textPrimary};
`;

const PageDescription = styled(motion.p)`
  color: ${props => props.theme.textSecondary};
  font-size: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 8px;
`;

const StatValue = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.theme.textPrimary};
  margin-bottom: 0;
`;

const StatIcon = styled.div`
  margin-left: auto;
  font-size: 1.8rem;
  color: ${props => props.theme.primary};
  opacity: 0.7;
`;

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    switch(tab) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'bots':
        navigate('/admin/bots');
        break;
      case 'forum':
        navigate('/admin/forum');
        break;
      case 'statistics':
        navigate('/admin/statistics');
        break;
      case 'reports':
        navigate('/admin/reports');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <AdminContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Admin Panel</SidebarTitle>
          <SidebarLogo><FaUserShield /></SidebarLogo>
        </SidebarHeader>
        
        <NavLink to="/admin" active={activeTab === 'dashboard' ? 1 : 0} onClick={() => handleTabChange('dashboard')}>
          <NavIcon><FaChartLine /></NavIcon>
          <NavText>Dashboard</NavText>
        </NavLink>
        
        <NavLink to="/admin/users" active={activeTab === 'users' ? 1 : 0} onClick={() => handleTabChange('users')}>
          <NavIcon><FaUsers /></NavIcon>
          <NavText>Users</NavText>
        </NavLink>
        
        <NavLink to="/admin/bots" active={activeTab === 'bots' ? 1 : 0} onClick={() => handleTabChange('bots')}>
          <NavIcon><FaRobot /></NavIcon>
          <NavText>Bots</NavText>
        </NavLink>
        
        <NavLink to="/admin/forum" active={activeTab === 'forum' ? 1 : 0} onClick={() => handleTabChange('forum')}>
          <NavIcon><FaComments /></NavIcon>
          <NavText>Forum</NavText>
        </NavLink>
        
        <NavLink to="/admin/statistics" active={activeTab === 'statistics' ? 1 : 0} onClick={() => handleTabChange('statistics')}>
          <NavIcon><FaChartLine /></NavIcon>
          <NavText>Statistics</NavText>
        </NavLink>
        
        <NavLink to="/admin/reports" active={activeTab === 'reports' ? 1 : 0} onClick={() => handleTabChange('reports')}>
          <NavIcon><FaFlag /></NavIcon>
          <NavText>Reports</NavText>
        </NavLink>
      </Sidebar>
      
      <MainContent>
        <Routes>
          <Route path="/" element={
            <>
              <PageHeader>
                <PageTitle
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Admin Dashboard
                </PageTitle>
                <PageDescription
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  Welcome back, {user?.username || 'Admin'}. Here's an overview of your platform.
                </PageDescription>
              </PageHeader>
              
              {loading ? (
                <LoadingSpinner />
              ) : (
                <StatsGrid>
                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <StatTitle>Total Users</StatTitle>
                    <StatValue>{stats?.totalUsers || 0}</StatValue>
                    <StatIcon><FaUsers /></StatIcon>
                  </StatCard>
                  
                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <StatTitle>Active Bots</StatTitle>
                    <StatValue>{stats?.activeBots || 0}</StatValue>
                    <StatIcon><FaRobot /></StatIcon>
                  </StatCard>
                  
                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <StatTitle>Forum Posts</StatTitle>
                    <StatValue>{stats?.forumPosts || 0}</StatValue>
                    <StatIcon><FaComments /></StatIcon>
                  </StatCard>
                  
                  <StatCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <StatTitle>Reported Content</StatTitle>
                    <StatValue>{stats?.reportedContent || 0}</StatValue>
                    <StatIcon><FaFlag /></StatIcon>
                  </StatCard>
                </StatsGrid>
              )}
            </>
          } />
          
          <Route path="/users" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <UsersManagement />
            </React.Suspense>
          } />
          
          <Route path="/bots" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <BotsManagement />
            </React.Suspense>
          } />
          
          <Route path="/forum" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <ForumManagement />
            </React.Suspense>
          } />
          
          <Route path="/statistics" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <Statistics />
            </React.Suspense>
          } />
          
          <Route path="/reports" element={
            <React.Suspense fallback={<LoadingSpinner />}>
              <ReportedContent />
            </React.Suspense>
          } />
        </Routes>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminDashboard;
