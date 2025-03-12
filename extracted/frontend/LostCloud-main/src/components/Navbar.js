
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
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCloud, FaMoon, FaSun, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NavContainer = styled.nav`
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.8rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  
  svg {
    color: #6c63ff;
    font-size: 1.8rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.active ? '#6c63ff' : '#ccc'};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    color: #6c63ff;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: #6c63ff;
    transition: all 0.2s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: #6c63ff;
    background: rgba(108, 99, 255, 0.1);
  }
`;

const AuthButton = styled(Link)`
  background: ${props => props.primary ? '#6c63ff' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#ccc'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? '#5a52d5' : 'rgba(108, 99, 255, 0.1)'};
    color: ${props => props.primary ? '#fff' : '#6c63ff'};
    border-color: ${props => props.primary ? 'none' : '#6c63ff'};
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: #6c63ff;
    background: rgba(108, 99, 255, 0.1);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const UserMenuDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.8rem);
  right: 0;
  background: rgba(30, 30, 30, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const UserMenuLink = styled(Link)`
  display: block;
  padding: 0.8rem 1.2rem;
  color: #ccc;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(108, 99, 255, 0.1);
    color: #6c63ff;
  }
`;

const UserMenuButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.8rem 1.2rem;
  color: #ff6b6b;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  
  &:hover {
    background: rgba(255, 107, 107, 0.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.4rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1001;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileMenuLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MobileLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  
  span {
    color: #6c63ff;
  }
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.4rem;
`;

const MobileNavLink = styled(Link)`
  color: #ccc;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: #6c63ff;
  }
`;

const MobileNavActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
`;

const MobileAuthButton = styled(Link)`
  background: ${props => props.primary ? '#6c63ff' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#ccc'};
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  padding: 0.8rem 1.2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.primary ? '#5a52d5' : 'rgba(108, 99, 255, 0.1)'};
    color: ${props => props.primary ? '#fff' : '#6c63ff'};
    border-color: ${props => props.primary ? 'none' : '#6c63ff'};
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <NavContainer>
      <NavContent>
        <LogoContainer to="/">
          <FaCloud /> LostCloud
        </LogoContainer>
        
        <NavLinks>
          <NavLink to="/" active={isActive('/') ? 'true' : undefined}>Home</NavLink>
          <NavLink to="/forum" active={isActive('/forum') ? 'true' : undefined}>Forum</NavLink>
          <NavLink to="/help" active={isActive('/help') ? 'true' : undefined}>Help</NavLink>
          {currentUser && (
            <NavLink to="/dashboard" active={isActive('/dashboard') ? 'true' : undefined}>Dashboard</NavLink>
          )}
          {currentUser && isAdmin() && (
            <NavLink to="/admin" active={location.pathname.startsWith('/admin') ? 'true' : undefined}>Admin</NavLink>
          )}
        </NavLinks>
        
        <NavActions>
          <ThemeToggle onClick={toggleTheme}>
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
          
          {!currentUser ? (
            <>
              <AuthButton to="/login">Login</AuthButton>
              <AuthButton to="/register" primary="true">Register</AuthButton>
            </>
          ) : (
            <UserMenu>
              <UserButton onClick={toggleUserMenu}>
                <FaUser />
              </UserButton>
              
              <AnimatePresence>
                {isUserMenuOpen && (
                  <UserMenuDropdown
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <UserMenuLink to="/profile">Profile</UserMenuLink>
                    <UserMenuLink to="/dashboard">Dashboard</UserMenuLink>
                    {isAdmin() && (
                      <UserMenuLink to="/admin">Admin Panel</UserMenuLink>
                    )}
                    <UserMenuButton onClick={handleLogout}>
                      Logout
                    </UserMenuButton>
                  </UserMenuDropdown>
                )}
              </AnimatePresence>
            </UserMenu>
          )}
          
          <MobileMenuButton onClick={toggleMobileMenu}>
            <FaBars />
          </MobileMenuButton>
        </NavActions>
      </NavContent>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <Overlay 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleMobileMenu}
            />
            
            <MobileMenu
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <MobileMenuHeader>
                <MobileLogo>
                  Lost<span>Cloud</span>
                </MobileLogo>
                <MobileCloseButton onClick={toggleMobileMenu}>
                  <FaTimes />
                </MobileCloseButton>
              </MobileMenuHeader>
              
              <MobileMenuLinks>
                <MobileNavLink to="/" onClick={toggleMobileMenu}>Home</MobileNavLink>
                <MobileNavLink to="/forum" onClick={toggleMobileMenu}>Forum</MobileNavLink>
                <MobileNavLink to="/help" onClick={toggleMobileMenu}>Help</MobileNavLink>
                {currentUser && (
                  <MobileNavLink to="/dashboard" onClick={toggleMobileMenu}>Dashboard</MobileNavLink>
                )}
                {currentUser && isAdmin() && (
                  <MobileNavLink to="/admin" onClick={toggleMobileMenu}>Admin</MobileNavLink>
                )}
              </MobileMenuLinks>
              
              <MobileNavActions>
                <ThemeToggle onClick={toggleTheme}>
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </ThemeToggle>
                
                {!currentUser ? (
                  <>
                    <MobileAuthButton to="/login" onClick={toggleMobileMenu}>Login</MobileAuthButton>
                    <MobileAuthButton to="/register" primary="true" onClick={toggleMobileMenu}>Register</MobileAuthButton>
                  </>
                ) : (
                  <>
                    <MobileAuthButton to="/profile" onClick={toggleMobileMenu}>Profile</MobileAuthButton>
                    <MobileAuthButton onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                      Logout
                    </MobileAuthButton>
                  </>
                )}
              </MobileNavActions>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </NavContainer>
  );
};

export default Navbar;
