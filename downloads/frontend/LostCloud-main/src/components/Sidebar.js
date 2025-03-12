
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaRobot, 
  FaPlus, 
  FaComments, 
  FaQuestionCircle,
  FaUserCog,
  FaSignOutAlt,
  FaChartBar
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SidebarContainer = styled.div`
  background: ${({ theme }) => theme.sidebarBackground};
  width: 250px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  padding-top: 60px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    width: 240px;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0;
  padding: 0;
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: ${({ theme }) => theme.sidebarText};
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  
  svg {
    margin-right: 10px;
    font-size: 1.1rem;
  }
  
  &:hover {
    background: ${({ theme }) => theme.sidebarHover};
    color: ${({ theme }) => theme.primaryColor};
  }
  
  &.active {
    background: ${({ theme }) => theme.primaryColor};
    color: white;
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.borderColor};
  margin: 10px 20px;
  opacity: 0.5;
`;

const SectionTitle = styled.h3`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.secondaryText};
  padding: 10px 20px;
  margin: 0;
  letter-spacing: 1px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.sidebarText};
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
  
  svg {
    margin-right: 10px;
    font-size: 1.1rem;
  }
  
  &:hover {
    background: ${({ theme }) => theme.sidebarHover};
    color: ${({ theme }) => theme.errorColor};
  }
`;

const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  return (
    <SidebarContainer isOpen={isOpen}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <NavList>
          <SectionTitle>General</SectionTitle>
          <NavItem>
            <motion.div variants={itemVariants}>
              <StyledNavLink to="/dashboard" onClick={handleLinkClick}>
                <FaHome /> Dashboard
              </StyledNavLink>
            </motion.div>
          </NavItem>
          
          <SectionDivider />
          <SectionTitle>Bot Management</SectionTitle>
          
          <NavItem>
            <motion.div variants={itemVariants}>
              <StyledNavLink to="/create-bot" onClick={handleLinkClick}>
                <FaPlus /> Create Bot
              </StyledNavLink>
            </motion.div>
          </NavItem>
          
          <NavItem>
            <motion.div variants={itemVariants}>
              <StyledNavLink to="/my-bots" onClick={handleLinkClick}>
                <FaRobot /> My Bots
              </StyledNavLink>
            </motion.div>
          </NavItem>
          
          <SectionDivider />
          <SectionTitle>Community</SectionTitle>
          
          <NavItem>
            <motion.div variants={itemVariants}>
              <StyledNavLink to="/forum" onClick={handleLinkClick}>
                <FaComments /> Forum
              </StyledNavLink>
            </motion.div>
          </NavItem>
          
          <NavItem>
            <motion.div variants={itemVariants}>
              <StyledNavLink to="/help" onClick={handleLinkClick}>
                <FaQuestionCircle /> Help Center
              </StyledNavLink>
            </motion.div>
          </NavItem>
          
          {user && user.role === 'admin' && (
            <>
              <SectionDivider />
              <SectionTitle>Administration</SectionTitle>
              
              <NavItem>
                <motion.div variants={itemVariants}>
                  <StyledNavLink to="/admin" onClick={handleLinkClick}>
                    <FaChartBar /> Admin Panel
                  </StyledNavLink>
                </motion.div>
              </NavItem>
            </>
          )}
          
          <SectionDivider />
          
          <NavItem>
            <motion.div variants={itemVariants}>
              <StyledNavLink to="/profile" onClick={handleLinkClick}>
                <FaUserCog /> Profile
              </StyledNavLink>
            </motion.div>
          </NavItem>
          
          <NavItem>
            <motion.div variants={itemVariants}>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </LogoutButton>
            </motion.div>
          </NavItem>
        </NavList>
      </motion.div>
    </SidebarContainer>
  );
};

export default Sidebar;
