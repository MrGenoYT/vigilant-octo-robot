
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SignupContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.cardBackground};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.borderColor};
  border-radius: 5px;
  background: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textColor};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primaryColor};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primaryColorLight};
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.primaryColor};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  
  &:hover {
    background: ${({ theme }) => theme.primaryColorDark};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.disabledColor};
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(Button)`
  background: #4285F4;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #3367D6;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const LoginLink = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  
  a {
    color: ${({ theme }) => theme.primaryColor};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.errorColor};
  background: ${({ theme }) => theme.errorBackground};
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.successColor};
  background: ${({ theme }) => theme.successBackground};
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { username, email, password, confirmPassword } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      
      setSuccess('Registration successful! Please check your email to verify your account.');
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Auto login if no email verification required
      if (res.data.token) {
        await login(res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignup = () => {
    window.location.href = '/api/auth/google';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SignupContainer>
        <h1>Create an Account</h1>
        <p>Join LostCloud to create and manage your Minecraft bots</p>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label htmlFor="username">
              <FaUser /> Username
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">
              <FaEnvelope /> Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">
              <FaLock /> Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">
              <FaLock /> Confirm Password
            </Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
          
          <GoogleButton type="button" onClick={handleGoogleSignup}>
            <FaGoogle /> Sign up with Google
          </GoogleButton>
        </Form>
        
        <LoginLink>
          Already have an account? <Link to="/login">Log in</Link>
        </LoginLink>
      </SignupContainer>
    </motion.div>
  );
};

export default Signup;
