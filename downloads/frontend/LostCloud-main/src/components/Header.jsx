
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #555;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #0066ff;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(Link)`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  
  ${props => props.primary && `
    background-color: #0066ff;
    color: white;
    
    &:hover {
      background-color: #0052cc;
    }
  `}
  
  ${props => !props.primary && `
    color: #333;
    
    &:hover {
      background-color: #f5f5f5;
    }
  `}
`;

const Header = () => {
  const { user, logout } = useAuth || { user: null, logout: () => {} };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">LostCloud</Logo>
        
        <NavLinks>
          <NavLink to="/features">Features</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/forum">Community</NavLink>
          <NavLink to="/docs">Documentation</NavLink>
        </NavLinks>
        
        <AuthButtons>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <Button as="button" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button to="/login" primary={false}>Login</Button>
              <Button to="/register" primary={true}>Sign Up</Button>
            </>
          )}
        </AuthButtons>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;
