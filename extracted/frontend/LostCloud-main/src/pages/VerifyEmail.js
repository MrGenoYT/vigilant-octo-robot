
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyEmail = () => {
  const [verifyStatus, setVerifyStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const verifyEmailToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        setVerifyStatus('error');
        setMessage('Verification token is missing.');
        return;
      }
      
      try {
        const response = await axios.post('/api/auth/verify-email', { token });
        setVerifyStatus('success');
        setMessage(response.data.message || 'Your email has been verified successfully!');
      } catch (error) {
        setVerifyStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email. The token may be invalid or expired.');
      }
    };
    
    verifyEmailToken();
  }, [location]);
  
  return (
    <Container>
      <Card>
        <CardHeader>Email Verification</CardHeader>
        
        <CardContent>
          {verifyStatus === 'loading' && (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Verifying your email...</LoadingText>
            </LoadingContainer>
          )}
          
          {verifyStatus === 'success' && (
            <StatusContainer success>
              <IconContainer success>
                <FaCheckCircle />
              </IconContainer>
              <h2>Email Verified!</h2>
              <StatusMessage>{message}</StatusMessage>
              <ButtonContainer>
                <StyledLink to="/login">Sign In</StyledLink>
              </ButtonContainer>
            </StatusContainer>
          )}
          
          {verifyStatus === 'error' && (
            <StatusContainer>
              <IconContainer>
                <FaTimesCircle />
              </IconContainer>
              <h2>Verification Failed</h2>
              <StatusMessage>{message}</StatusMessage>
              <ButtonContainer>
                <StyledLink to="/login">Back to Login</StyledLink>
              </ButtonContainer>
            </StatusContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  background-color: ${props => props.theme.primaryColor};
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: ${props => props.theme.textSecondary};
`;

const StatusContainer = styled.div`
  text-align: center;
  padding: 1rem 0;
  
  h2 {
    margin-bottom: 1rem;
    color: ${props => props.success ? '#4CAF50' : '#FF5252'};
  }
`;

const IconContainer = styled.div`
  font-size: 4rem;
  color: ${props => props.success ? '#4CAF50' : '#FF5252'};
  margin-bottom: 1rem;
`;

const StatusMessage = styled.p`
  margin-bottom: 2rem;
  color: ${props => props.theme.textColor};
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.primaryColor};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.secondaryColor};
  }
`;

export default VerifyEmail;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { media } from '../styles/GlobalStyles';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};
  text-align: center;
  
  ${media.md} {
    margin: 30px auto;
    padding: 20px;
  }
`;

const Title = styled.h1`
  margin-bottom: 16px;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
`;

const Message = styled.p`
  font-size: 1.1rem;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
`;

const StyledLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  margin-top: 20px;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
`;

const StatusIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmailIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 40px;
    height: 40px;
    fill: white;
  }
`;

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(response.data.message || 'Your email has been successfully verified!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
    }
  }, [token]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {status === 'success' ? (
        <EmailIcon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </EmailIcon>
      ) : (
        <StatusIcon>❌</StatusIcon>
      )}
      
      <Title>
        {status === 'success' ? 'Email Verified' : 'Verification Failed'}
      </Title>
      
      <Message>{message}</Message>
      
      <StyledLink to="/login">
        {status === 'success' ? 'Proceed to Login' : 'Back to Login'}
      </StyledLink>
    </Container>
  );
};

export default VerifyEmail;
