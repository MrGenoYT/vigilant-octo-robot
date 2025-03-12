
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlus, FaComment, FaUser, FaHeart, FaClock, FaThumbtack } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ForumContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ForumHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ForumTitle = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  margin: 0;
`;

const CreatePostButton = styled(motion.button)`
  background: linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(108, 99, 255, 0.5);
    border-radius: 10px;
  }
`;

const CategoryTab = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%)' : 'rgba(30, 30, 30, 0.6)'};
  color: ${props => props.active ? 'white' : '#aaa'};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: fit-content;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%)' : 'rgba(40, 40, 40, 0.8)'};
    color: ${props => props.active ? 'white' : '#ddd'};
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const Post = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(108, 99, 255, 0.3);
    background: rgba(35, 35, 35, 0.7);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const PostTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #fff;
  font-weight: 600;
  
  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      color: #6c63ff;
    }
  }
`;

const PostMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #aaa;
  font-size: 0.85rem;
`;

const PostMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const PostContent = styled.p`
  color: #ddd;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PostStats = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const PostStat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #aaa;
  font-size: 0.85rem;
`;

const CategoryBadge = styled.span`
  background: rgba(108, 99, 255, 0.2);
  color: #6c63ff;
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
`;

const PinIcon = styled(FaThumbtack)`
  position: absolute;
  top: -8px;
  right: 20px;
  color: #6c63ff;
  transform: rotate(45deg);
  font-size: 1.2rem;
`;

const NoPostsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #aaa;
  font-size: 1.1rem;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%)' : 'rgba(30, 30, 30, 0.6)'};
  color: ${props => props.active ? 'white' : '#aaa'};
  border: 1px solid ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(90deg, #6c63ff 0%, #5a4fff 100%)' : 'rgba(40, 40, 40, 0.8)'};
    color: ${props => props.active ? 'white' : '#ddd'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const categories = [
  { id: 'all', name: 'All Posts' },
  { id: 'announcements', name: 'Announcements' },
  { id: 'general', name: 'General Discussion' },
  { id: 'help', name: 'Help & Support' },
  { id: 'showcase', name: 'Bot Showcase' },
  { id: 'guides', name: 'Guides & Tutorials' },
  { id: 'feedback', name: 'Feedback & Suggestions' }
];

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URL}/forum?page=${currentPage}&limit=${postsPerPage}`;
      if (activeCategory !== 'all') {
        url += `&category=${activeCategory}`;
      }
      
      const response = await axios.get(url);
      setPosts(response.data.posts);
      setTotalPages(Math.ceil(response.data.total / postsPerPage));
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load forum posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/forum/create');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <ForumContainer>
        <ForumHeader>
          <ForumTitle>Forum</ForumTitle>
        </ForumHeader>
        <LoadingSpinner />
      </ForumContainer>
    );
  }

  if (error) {
    return (
      <ForumContainer>
        <ForumHeader>
          <ForumTitle>Forum</ForumTitle>
        </ForumHeader>
        <NoPostsMessage>{error}</NoPostsMessage>
      </ForumContainer>
    );
  }

  return (
    <ForumContainer>
      <ForumHeader>
        <ForumTitle>Forum</ForumTitle>
        {user && (
          <CreatePostButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreatePost}
          >
            <FaPlus /> Create Post
          </CreatePostButton>
        )}
      </ForumHeader>

      <CategoryTabs>
        {categories.map(category => (
          <CategoryTab
            key={category.id}
            active={activeCategory === category.id}
            onClick={() => {
              setActiveCategory(category.id);
              setCurrentPage(1);
            }}
          >
            {category.name}
          </CategoryTab>
        ))}
      </CategoryTabs>

      {posts.length === 0 ? (
        <NoPostsMessage>
          No posts found in this category. Be the first to post!
        </NoPostsMessage>
      ) : (
        <PostsGrid>
          {posts.map((post, index) => (
            <Post
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {post.isPinned && <PinIcon />}
              
              <PostHeader>
                <PostTitle>
                  <Link to={`/forum/${post._id}`}>{post.title}</Link>
                </PostTitle>
                <CategoryBadge>
                  {categories.find(c => c.id === post.category)?.name || post.category}
                </CategoryBadge>
              </PostHeader>

              <PostMeta>
                <PostMetaItem>
                  <FaUser />
                  {post.author.username}
                </PostMetaItem>
                <PostMetaItem>
                  <FaClock />
                  {formatDate(post.createdAt)}
                </PostMetaItem>
              </PostMeta>

              <PostContent>{truncateText(post.content)}</PostContent>

              <PostFooter>
                <PostStats>
                  <PostStat>
                    <FaComment />
                    {post.commentCount || 0} comments
                  </PostStat>
                  <PostStat>
                    <FaHeart />
                    {post.likes || 0} likes
                  </PostStat>
                </PostStats>
              </PostFooter>
            </Post>
          ))}
        </PostsGrid>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PageButton 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </PageButton>
          
          {[...Array(totalPages).keys()].map(page => (
            <PageButton
              key={page + 1}
              active={currentPage === page + 1}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </PageButton>
          ))}
          
          <PageButton 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </PageButton>
        </Pagination>
      )}
    </ForumContainer>
  );
};

export default Forum;
