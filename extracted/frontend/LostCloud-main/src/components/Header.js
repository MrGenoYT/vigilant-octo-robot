
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background-color: var(--card-background);
  box-shadow: 0 2px 10px var(--shadow-color);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  
  img {
    height: 35px;
    margin-right: 0.5rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    flex-direction: column;
    background-color: var(--card-background);
    padding: 2rem;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    box-shadow: -5px 0 15px var(--shadow-color);
    z-index: 1000;
  }
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary-color);
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--text-color)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--border-color)'};
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 0.5rem;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-hover)' : 'var(--border-color)'};
  }
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    width: 100%;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <Logo to="/">
        <img src="/logo.svg" alt="LostCloud Logo" />
        LostCloud
      </Logo>
      
      <MenuButton onClick={toggleMenu}>
        <FaBars />
      </MenuButton>
      
      <Nav isOpen={menuOpen}>
        <CloseButton onClick={closeMenu}>
          <FaTimes />
        </CloseButton>
        
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
        <NavLink to="/bots" onClick={closeMenu}>Bot Manager</NavLink>
        <NavLink to="/forum" onClick={closeMenu}>Forum</NavLink>
        <NavLink to="/help" onClick={closeMenu}>Help</NavLink>
        
        <AuthButtons>
          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMenu}>
                <FaUser /> Profile
              </NavLink>
              <Button onClick={() => { logout(); closeMenu(); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" onClick={closeMenu}>
                Login
              </Button>
              <Button primary as={Link} to="/register" onClick={closeMenu}>
                Sign Up
              </Button>
            </>
          )}
        </AuthButtons>
        
        <ThemeToggle onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </ThemeToggle>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.onSurface};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    width: 250px;
    height: 100vh;
    background-color: ${props => props.theme.colors.surface};
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 5rem 2rem;
    transition: right 0.3s ease;
    box-shadow: ${props => props.isOpen ? '-5px 0 15px rgba(0, 0, 0, 0.1)' : 'none'};
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.onSurface};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.onSurface};
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.onSurface};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 200;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.onSurface};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${props => props.theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 10;
  margin-top: 0.5rem;
  overflow: hidden;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const UserMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.onSurface};
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const UserMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: ${props => props.theme.colors.onSurface};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Overlay = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
`;

const ProfilePic = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const AuthButton = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &.login {
    color: ${props => props.theme.colors.primary};
    border: 1px solid ${props => props.theme.colors.primary};
    
    &:hover {
      background-color: rgba(187, 134, 252, 0.1);
    }
  }
  
  &.register {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.onPrimary};
    
    &:hover {
      opacity: 0.9;
    }
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };
  
  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  return (
    <HeaderContainer>
      <Logo to="/">
        <img src="/logo.png" alt="LostCloud" height="30" />
        LostCloud
      </Logo>
      
      <MobileMenuButton onClick={toggleMobileMenu}>
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
      
      <Overlay isOpen={mobileMenuOpen} onClick={toggleMobileMenu} />
      
      <Nav isOpen={mobileMenuOpen}>
        <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
        <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
        <NavLink to="/forum" onClick={() => setMobileMenuOpen(false)}>Forum</NavLink>
        <NavLink to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</NavLink>
        <NavLink to="/docs" onClick={() => setMobileMenuOpen(false)}>Documentation</NavLink>
        
        {user ? (
          <UserMenu onClick={(e) => e.stopPropagation()}>
            <UserButton onClick={toggleUserMenu}>
              {user.profilePicture ? (
                <ProfilePic src={user.profilePicture} alt={user.username} />
              ) : (
                <FaUser />
              )}
              {user.username}
            </UserButton>
            
            <UserMenuDropdown isOpen={userMenuOpen}>
              <UserMenuItem to="/profile" onClick={() => setUserMenuOpen(false)}>
                <FaUser />
                Profile
              </UserMenuItem>
              <UserMenuButton onClick={handleLogout}>
                <FaSignOutAlt />
                Logout
              </UserMenuButton>
            </UserMenuDropdown>
          </UserMenu>
        ) : (
          <AuthButtons>
            <AuthButton to="/login" className="login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </AuthButton>
            <AuthButton to="/register" className="register" onClick={() => setMobileMenuOpen(false)}>
              Register
            </AuthButton>
          </AuthButtons>
        )}
        
        <ThemeToggle onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? <FaSun /> : <FaMoon />}
        </ThemeToggle>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
