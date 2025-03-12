
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaClock, FaHeart, FaReply, FaTrash, FaEdit, FaThumbtack, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PostContainer = styled.div`
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

const PostContent = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
`;

const PostHeader = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const PostTitle = styled.h1`
  font-size: 2rem;
  color: #fff;
  margin: 0 0 1rem 0;
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  color: #aaa;
  font-size: 0.9rem;
`;

const PostMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryBadge = styled.span`
  background: rgba(108, 99, 255, 0.2);
  color: #6c63ff;
  font-size: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-weight: 500;
  position: absolute;
  right: 0;
  top: 0;
`;

const PostBody = styled.div`
  color: #ddd;
  font-size: 1.05rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  
  p {
    margin-bottom: 1.5rem;
  }
  
  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }
  
  a {
    color: #6c63ff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  blockquote {
    border-left: 4px solid #6c63ff;
    padding-left: 1rem;
    margin-left: 0;
    color: #aaa;
  }
  
  code {
    background: rgba(0, 0, 0, 0.3);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
  
  pre {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    
    code {
      background: none;
      padding: 0;
    }
  }
`;

const PostActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 'rgba(255, 87, 87, 0.2)' : props.secondary ? 'rgba(255, 255, 255, 0.1)' : 'rgba(108, 99, 255, 0.2)'};
  color: ${props => props.danger ? '#ff5757' : props.secondary ? '#ccc' : '#6c63ff'};
  border: 1px solid ${props => props.danger ? 'rgba(255, 87, 87, 0.3)' : props.secondary ? 'rgba(255, 255, 255, 0.2)' : 'rgba(108, 99, 255, 0.3)'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? 'rgba(255, 87, 87, 0.3)' : props.secondary ? 'rgba(255, 255, 255, 0.15)' : 'rgba(108, 99, 255, 0.3)'};
  }
`;

const CommentsSection = styled.div`
  margin-top: 3rem;
`;

const CommentsSectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #fff;
  margin: 0 0 1.5rem 0;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Comment = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ddd;
  font-weight: 500;
`;

const CommentDate = styled.div`
  color: #aaa;
  font-size: 0.85rem;
`;

const CommentBody = styled.div`
  color: #ddd;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;
`;

const CommentForm = styled.form`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 2rem;
`;

const CommentFormTitle = styled.h4`
  font-size: 1.2rem;
  color: #fff;
  margin: 0 0 1rem 0;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const CommentSubmitButton = styled.button`
  background: linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

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

const PinIcon = styled(FaThumbtack)`
  margin-left: 0.5rem;
  color: #6c63ff;
  transform: rotate(45deg);
`;

const NoCommentsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0 1rem;
`;

const ModalContent = styled.div`
  background: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h3`
  color: #fff;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  background: ${props => props.danger ? 'rgba(255, 87, 87, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.danger ? 'white' : '#ccc'};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.danger ? '#ff5757' : 'rgba(255, 255, 255, 0.15)'};
  }
`;

const ForumPost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isAdmin = user && user.email === 'ankittsu2@gmail.com';

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/forum/${postId}`);
      setPost(response.data.post);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError('Failed to load the post. It may have been deleted or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/forum/${postId}/comments`, {
        content: newComment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/forum/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/forum');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleTogglePin = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/forum/${postId}/pin`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setPost({...post, isPinned: !post.isPinned});
    } catch (err) {
      console.error('Failed to toggle pin status:', err);
      alert('Failed to update pin status. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/forum/${postId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setComments(comments.filter(comment => comment._id !== commentId));
      setShowDeleteModal(false);
      setDeletingComment(null);
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const confirmDeleteComment = (commentId) => {
    setDeletingComment(commentId);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const canEditPost = user && post && (user._id === post.author._id || isAdmin);
  const canDeletePost = user && post && (user._id === post.author._id || isAdmin);
  const canPinPost = user && isAdmin;

  if (loading) {
    return (
      <PostContainer>
        <BackButton onClick={() => navigate('/forum')}>
          &larr; Back to Forum
        </BackButton>
        <LoadingSpinner />
      </PostContainer>
    );
  }

  if (error || !post) {
    return (
      <PostContainer>
        <BackButton onClick={() => navigate('/forum')}>
          &larr; Back to Forum
        </BackButton>
        <PostContent>
          <h2>Error</h2>
          <p>{error || 'Post not found'}</p>
        </PostContent>
      </PostContainer>
    );
  }

  return (
    <PostContainer>
      <BackButton onClick={() => navigate('/forum')}>
        &larr; Back to Forum
      </BackButton>
      
      <PostContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PostHeader>
          <PostTitle>
            {post.title}
            {post.isPinned && <PinIcon />}
          </PostTitle>
          <CategoryBadge>
            {post.category}
          </CategoryBadge>
          
          <PostMeta>
            <PostMetaItem>
              <FaUser />
              {post.author.username}
            </PostMetaItem>
            <PostMetaItem>
              <FaClock />
              {formatDate(post.createdAt)}
            </PostMetaItem>
            <PostMetaItem>
              <FaHeart />
              {post.likes || 0} likes
            </PostMetaItem>
          </PostMeta>
        </PostHeader>
        
        <PostBody dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {(canEditPost || canDeletePost || canPinPost) && (
          <PostActions>
            {canEditPost && (
              <ActionButton onClick={() => navigate(`/forum/${postId}/edit`)}>
                <FaEdit /> Edit Post
              </ActionButton>
            )}
            
            {canDeletePost && (
              <ActionButton danger onClick={() => setShowDeleteModal(true)}>
                <FaTrash /> Delete Post
              </ActionButton>
            )}
            
            {canPinPost && (
              <ActionButton secondary onClick={handleTogglePin}>
                <FaThumbtack /> {post.isPinned ? 'Unpin Post' : 'Pin Post'}
              </ActionButton>
            )}
          </PostActions>
        )}
      </PostContent>
      
      <CommentsSection>
        <CommentsSectionTitle>Comments ({comments.length})</CommentsSectionTitle>
        
        {user ? (
          <CommentForm onSubmit={handleSubmitComment}>
            <CommentFormTitle>Leave a Comment</CommentFormTitle>
            <CommentTextarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              required
            />
            <CommentSubmitButton type="submit" disabled={submitting || !newComment.trim()}>
              <FaReply /> {submitting ? 'Posting...' : 'Post Comment'}
            </CommentSubmitButton>
          </CommentForm>
        ) : (
          <CommentForm as="div">
            <CommentFormTitle>Join the Discussion</CommentFormTitle>
            <p style={{ color: '#aaa' }}>Please log in to leave a comment.</p>
            <CommentSubmitButton as="a" href="/login" style={{ display: 'inline-flex' }}>
              Log In
            </CommentSubmitButton>
          </CommentForm>
        )}
        
        {comments.length === 0 ? (
          <NoCommentsMessage>
            No comments yet. Be the first to share your thoughts!
          </NoCommentsMessage>
        ) : (
          <CommentsList>
            {comments.map((comment, index) => (
              <Comment
                key={comment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <CommentHeader>
                  <CommentAuthor>
                    <FaUser />
                    {comment.author.username}
                  </CommentAuthor>
                  <CommentDate>{formatDate(comment.createdAt)}</CommentDate>
                </CommentHeader>
                
                <CommentBody>{comment.content}</CommentBody>
                
                {(user && (user._id === comment.author._id || isAdmin)) && (
                  <CommentActions>
                    <ActionButton danger onClick={() => confirmDeleteComment(comment._id)}>
                      <FaTrash /> Delete
                    </ActionButton>
                  </CommentActions>
                )}
              </Comment>
            ))}
          </CommentsList>
        )}
      </CommentsSection>
      
      {showDeleteModal && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>
              <FaExclamationTriangle style={{ color: '#ff5757' }} />
              {deletingComment ? 'Delete Comment?' : 'Delete Post?'}
            </ModalTitle>
            <p style={{ color: '#ddd' }}>
              {deletingComment 
                ? 'Are you sure you want to delete this comment? This action cannot be undone.'
                : 'Are you sure you want to delete this post? All comments will also be deleted. This action cannot be undone.'
              }
            </p>
            <ModalButtons>
              <ModalButton onClick={() => {
                setShowDeleteModal(false);
                setDeletingComment(null);
              }}>
                Cancel
              </ModalButton>
              <ModalButton danger onClick={() => {
                if (deletingComment) {
                  handleDeleteComment(deletingComment);
                } else {
                  handleDeletePost();
                }
              }}>
                Delete
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      )}
    </PostContainer>
  );
};

export default ForumPost;
