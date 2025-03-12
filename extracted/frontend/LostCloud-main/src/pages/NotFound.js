
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHome, FaQuestionCircle } from 'react-icons/fa';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 0 20px;
`;

const StatusCode = styled(motion.h1)`
  font-size: 8rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
  margin-bottom: 0;
  line-height: 1;
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.textPrimary};
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  max-width: 500px;
  margin-bottom: 2rem;
  color: ${props => props.theme.textSecondary};
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.primary ? props.theme.primary : 'transparent'};
  color: ${props => props.primary ? '#fff' : props.theme.textPrimary};
  border: 2px solid ${props => props.primary ? props.theme.primary : props.theme.borderColor};
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.primary ? props.theme.primaryHover : props.theme.hoverBackground};
    transform: translateY(-2px);
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <StatusCode
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        404
      </StatusCode>
      <Title
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Page Not Found
      </Title>
      <Description
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Oops! The page you are looking for doesn't exist or has been moved.
      </Description>
      <ButtonsContainer
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button to="/" primary="true">
          <FaHome /> Go Home
        </Button>
        <Button to="/help">
          <FaQuestionCircle /> Get Help
        </Button>
      </ButtonsContainer>
    </NotFoundContainer>
  );
};

export default NotFound;
