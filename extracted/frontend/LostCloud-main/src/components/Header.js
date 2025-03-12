
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
