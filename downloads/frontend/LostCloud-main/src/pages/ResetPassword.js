
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaLock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get('token');
    
    if (!urlToken) {
      setError('Reset password token is missing.');
      setTokenChecked(true);
      return;
    }
    
    setToken(urlToken);
    
    // Verify if token is valid
    const verifyToken = async () => {
      try {
        setLoading(true);
        await axios.post('/api/auth/verify-reset-token', { token: urlToken });
        setTokenValid(true);
        setTokenChecked(true);
        setLoading(false);
      } catch (err) {
        setError('Password reset link is invalid or has expired.');
        setTokenValid(false);
        setTokenChecked(true);
        setLoading(false);
      }
    };
    
    verifyToken();
  }, [location]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await axios.post('/api/auth/reset-password', {
        token,
        password
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };
  
  if (loading && !tokenChecked) {
    return (
      <Container>
        <Card>
          <CardHeader>Reset Password</CardHeader>
          <CardContent>
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>Verifying your reset link...</LoadingText>
            </LoadingContainer>
          </CardContent>
        </Card>
      </Container>
    );
  }
  
  if (tokenChecked && !tokenValid) {
    return (
      <Container>
        <Card>
          <CardHeader>Reset Password</CardHeader>
          <CardContent>
            <StatusContainer>
              <IconContainer>
                <FaTimesCircle />
              </IconContainer>
              <h2>Invalid Link</h2>
              <StatusMessage>{error}</StatusMessage>
              <p>
                Please request a new password reset link from the{' '}
                <StyledLink to="/login">login page</StyledLink>.
              </p>
            </StatusContainer>
          </CardContent>
        </Card>
      </Container>
    );
  }
  
  if (success) {
    return (
      <Container>
        <Card>
          <CardHeader>Reset Password</CardHeader>
          <CardContent>
            <StatusContainer success>
              <IconContainer success>
                <FaCheckCircle />
              </IconContainer>
              <h2>Password Reset Successful!</h2>
              <StatusMessage>Your password has been updated successfully.</StatusMessage>
              <p>You will be redirected to the login page shortly...</p>
            </StatusContainer>
          </CardContent>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container>
      <Card>
        <CardHeader>Reset Password</CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <FormGroup>
              <Label htmlFor="password">New Password</Label>
              <InputGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <InputGroup>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            
            <PasswordRequirements>
              <p>Password must:</p>
              <ul>
                <Requirement met={password.length >= 8}>
                  Be at least 8 characters long
                </Requirement>
                <Requirement met={/[A-Z]/.test(password)}>
                  Include at least one uppercase letter
                </Requirement>
                <Requirement met={/[0-9]/.test(password)}>
                  Include at least one number
                </Requirement>
                <Requirement met={/[^A-Za-z0-9]/.test(password)}>
                  Include at least one special character
                </Requirement>
              </ul>
            </PasswordRequirements>
            
            <Button type="submit" disabled={loading}>
              {loading ? <LoadingSpinner size={20} /> : 'Reset Password'}
            </Button>
          </Form>
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: ${props => props.theme.textColor};
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.borderColor};
  border-radius: 5px;
  overflow: hidden;
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  color: ${props => props.theme.textSecondary};
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  color: ${props => props.theme.textColor};
  
  &:focus {
    outline: none;
  }
`;

const PasswordRequirements = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  
  p {
    margin-top: 0;
    font-weight: bold;
  }
  
  ul {
    margin-bottom: 0;
    padding-left: 1.5rem;
  }
`;

const Requirement = styled.li`
  margin-bottom: 0.5rem;
  color: ${props => props.met ? '#4CAF50' : props.theme.textSecondary};
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${props => props.theme.primaryColor};
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.secondaryColor};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: rgba(255, 0, 0, 0.1);
  color: #FF5252;
  border-radius: 5px;
  text-align: center;
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

const StyledLink = styled(Link)`
  color: ${props => props.theme.primaryColor};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default ResetPassword;
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { media } from '../styles/GlobalStyles';

const Container = styled.div`
  max-width: 450px;
  margin: 50px auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 2px 10px ${({ theme }) => theme.shadow};
  
  ${media.md} {
    margin: 30px auto;
    padding: 15px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.text};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 4px;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;
  
  &:hover {
    background-color: ${({ theme }) => theme.primaryHover};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.disabled};
    cursor: not-allowed;
  }
`;

const AlertMessage = styled.div`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-weight: 500;
  
  &.error {
    background-color: #ffe0e0;
    color: #d32f2f;
    border: 1px solid #f5c2c7;
  }
  
  &.success {
    background-color: #e0f7e6;
    color: #198754;
    border: 1px solid #badbcc;
  }
`;

const PasswordRequirements = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-top: 8px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.secondary};
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validatePassword()) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/reset-password', { token, password });
      setSuccess(response.data.message || 'Password reset successful! You can now log in with your new password.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Reset Your Password</Title>
      
      {error && <AlertMessage className="error">{error}</AlertMessage>}
      {success && <AlertMessage className="success">{success}</AlertMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="password">New Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordRequirements>
            <li>• At least 8 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
          </PasswordRequirements>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPassword;
