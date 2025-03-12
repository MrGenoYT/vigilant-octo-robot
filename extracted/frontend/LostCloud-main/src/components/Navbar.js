
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProfileDropdown]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          <img src="/logo.png" alt="LostCloud Logo" />
          <span>LostCloud</span>
        </Logo>

        <NavLinks>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/forum">Forum</NavLink>
          <NavLink to="/help">Help</NavLink>
          {user && user.isAdmin && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </NavLinks>

        {user ? (
          <UserActions className="profile-dropdown">
            <UserProfile onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              <UserAvatar>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <FaUser />
                )}
              </UserAvatar>
              <span>{user.username}</span>
            </UserProfile>

            <AnimatePresence>
              {showProfileDropdown && (
                <ProfileDropdown
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownItem to="/profile">
                    <FaUser />
                    <span>Profile</span>
                  </DropdownItem>
                  <DropdownItem to="/settings">
                    <FaCog />
                    <span>Settings</span>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem as="button" onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </DropdownItem>
                </ProfileDropdown>
              )}
            </AnimatePresence>
          </UserActions>
        ) : (
          <AuthButtons>
            <LoginButton to="/login">Login</LoginButton>
            <RegisterButton to="/register">Register</RegisterButton>
          </AuthButtons>
        )}

        <MobileMenuButton onClick={() => setShowMobileMenu(true)}>
          <FaBars />
        </MobileMenuButton>

        <AnimatePresence>
          {showMobileMenu && (
            <>
              <Overlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeMobileMenu}
              />
              <MobileMenu
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              >
                <CloseButton onClick={closeMobileMenu}>
                  <FaTimes />
                </CloseButton>

                <Logo to="/" onClick={closeMobileMenu}>
                  <img src="/logo.png" alt="LostCloud Logo" />
                  <span>LostCloud</span>
                </Logo>

                <MobileNavLinks>
                  <MobileNavLink to="/dashboard" onClick={closeMobileMenu}>
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/forum" onClick={closeMobileMenu}>
                    Forum
                  </MobileNavLink>
                  <MobileNavLink to="/help" onClick={closeMobileMenu}>
                    Help
                  </MobileNavLink>
                  {user && user.isAdmin && (
                    <MobileNavLink to="/admin" onClick={closeMobileMenu}>
                      Admin
                    </MobileNavLink>
                  )}
                </MobileNavLinks>

                {user ? (
                  <MobileUserActions>
                    <MobileNavLink to="/profile" onClick={closeMobileMenu}>
                      Profile
                    </MobileNavLink>
                    <MobileNavLink to="/settings" onClick={closeMobileMenu}>
                      Settings
                    </MobileNavLink>
                    <MobileLogoutButton onClick={() => { handleLogout(); closeMobileMenu(); }}>
                      Logout
                    </MobileLogoutButton>
                  </MobileUserActions>
                ) : (
                  <MobileAuthButtons>
                    <MobileAuthButton to="/login" onClick={closeMobileMenu}>
                      Login
                    </MobileAuthButton>
                    <MobileAuthButton to="/register" onClick={closeMobileMenu}>
                      Register
                    </MobileAuthButton>
                  </MobileAuthButtons>
                )}
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </NavContent>
    </NavbarContainer>
  );
}

// Styled components
const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  z-index: 100;
`;

const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.25rem;

  img {
    height: 32px;
    width: auto;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #ddd;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #6c63ff;
  }
`;

const UserActions = styled.div`
  position: relative;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #6c63ff;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const ProfileDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  min-width: 180px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #ddd;
  text-decoration: none;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.25rem 0;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: #ddd;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const RegisterButton = styled(Link)`
  padding: 0.5rem 1rem;
  color: white;
  background: #6c63ff;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a52d5;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 300px;
  background: #1a1a1a;
  z-index: 1001;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileNavLink = styled(Link)`
  color: #ddd;
  text-decoration: none;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const MobileUserActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
`;

const MobileLogoutButton = styled.button`
  background: rgba(255, 87, 87, 0.2);
  color: #ff5757;
  border: 1px solid rgba(255, 87, 87, 0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 87, 87, 0.3);
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
`;

const MobileAuthButton = styled(Link)`
  padding: 0.75rem 1rem;
  color: white;
  background: ${props => props.to === '/login' ? 'rgba(255, 255, 255, 0.1)' : '#6c63ff'};
  border-radius: 8px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.to === '/login' ? 'rgba(255, 255, 255, 0.15)' : '#5a52d5'};
  }
`;

export default Navbar;
