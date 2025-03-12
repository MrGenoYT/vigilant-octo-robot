
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const CreatePostContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #6c63ff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const FormCard = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  color: #fff;
  margin: 0 0 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #ddd;
  font-size: 1rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
  
  option {
    background: #1e1e1e;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
  }
  
  &:disabled {
    background: #444;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #ccc;
  border: none;
  border-radius: 10px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  margin-top: 2rem;
  margin-right: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ErrorMessage = styled.div`
  background: rgba(255, 87, 87, 0.2);
  color: #ff5757;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const categories = [
  { id: 'general', name: 'General Discussion' },
  { id: 'help', name: 'Help & Support' },
  { id: 'showcase', name: 'Bot Showcase' },
  { id: 'guides', name: 'Guides & Tutorials' },
  { id: 'feedback', name: 'Feedback & Suggestions' }
];

const CreateForumPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    content: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a title for your post.');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Please enter content for your post.');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/forum`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      navigate(`/forum/${response.data._id}`);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CreatePostContainer>
      <BackButton onClick={() => navigate('/forum')}>
        &larr; Back to Forum
      </BackButton>
      
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormTitle>Create New Post</FormTitle>
        
        {error && (
          <ErrorMessage>
            <FaTimes /> {error}
          </ErrorMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormInput
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              maxLength={100}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="category">Category</FormLabel>
            <FormSelect
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="content">Content</FormLabel>
            <FormTextarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts, questions, or ideas..."
            />
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={() => navigate('/forum')}>
              <FaTimes /> Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={submitting}>
              <FaPaperPlane /> {submitting ? 'Posting...' : 'Create Post'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </FormCard>
    </CreatePostContainer>
  );
};

export default CreateForumPost;
