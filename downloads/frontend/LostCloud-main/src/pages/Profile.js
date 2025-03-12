
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaEnvelope, FaEdit } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEdit, FaLock, FaTrash, FaRobot, FaCalendarAlt, FaEnvelope, FaUserEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 2rem;
  }
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.2);
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const EditAvatarButton = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #6c63ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AdminBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  background-color: #f44336;
  color: white;
  border-radius: 4px;
  font-weight: 500;
`;

const ModeratorBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  background-color: #ff9800;
  color: white;
  border-radius: 4px;
  font-weight: 500;
`;

const ProfileMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  color: #aaa;
  font-size: 0.9rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileBio = styled.p`
  margin-top: 1rem;
  color: #ddd;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 800px;
`;

const EditButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  
  &:hover {
    background-color: #5a52d5;
  }
`;

const ProfileTabs = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: ${props => props.active ? '#6c63ff' : '#aaa'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: #6c63ff;
    opacity: ${props => props.active ? '1' : '0'};
    transition: opacity 0.2s;
  }
  
  &:hover {
    color: ${props => props.active ? '#6c63ff' : '#ddd'};
  }
`;

const TabContent = styled.div`
  padding: 1rem 0;
`;

const BotsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BotCard = styled.div`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const BotTitle = styled.h3`
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const BotServer = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
`;

const BotStatus = styled.div`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
  background-color: ${props => 
    props.status === 'online' ? '#4caf50' : 
    props.status === 'connecting' ? '#ff9800' : '#f44336'};
  color: white;
  border-radius: 4px;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const BotActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BotActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  color: ${props => props.color || '#fff'};
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const PostsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PostCard = styled.div`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const PostTitle = styled.h3`
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 1rem;
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostStats = styled.div`
  display: flex;
  gap: 1rem;
  color: #aaa;
  font-size: 0.9rem;
`;

const EditProfileModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: rgba(30, 30, 30, 0.95);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
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
  padding: 0.8rem 1rem;
  color: #fff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  color: #fff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const SaveButton = styled(motion.button)`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #6c63ff;
  color: white;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #5a52d5;
  }
  
  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(motion.button)`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: transparent;
  color: #aaa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #ddd;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #aaa;
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #4caf50;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bots');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: '',
    bio: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const isOwnProfile = !id || (user && id === user._id);
  const profileId = id || (user && user._id);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!profileId) {
          setLoading(false);
          return;
        }
        
        const endpoint = isOwnProfile ? '/api/users/me' : `/api/users/${profileId}`;
        const response = await axios.get(endpoint, { withCredentials: true });
        
        setProfileData(response.data);
        
        if (isOwnProfile) {
          setEditFormData({
            username: response.data.username || '',
            bio: response.data.bio || ''
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [profileId, isOwnProfile]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const openEditModal = () => {
    setShowEditModal(true);
  };
  
  const closeEditModal = () => {
    setShowEditModal(false);
    setError('');
    setSuccess('');
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.put('/api/users/profile', editFormData, { withCredentials: true });
      
      // Update local state
      setProfileData({
        ...profileData,
        ...response.data
      });
      
      // Update auth context
      updateUser(response.data);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        closeEditModal();
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    
    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size should be less than 2MB');
      return;
    }
    
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    try {
      const response = await axios.post('/api/users/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      // Update local state
      setProfileData({
        ...profileData,
        profilePicture: response.data.profilePicture
      });
      
      // Update auth context
      updateUser({
        ...user,
        profilePicture: response.data.profilePicture
      });
      
      setSuccess('Profile picture updated successfully!');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      setError(err.response?.data?.message || 'Failed to update profile picture. Please try again.');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const navigateToBot = (botId) => {
    navigate(`/dashboard?botId=${botId}`);
  };
  
  const navigateToPost = (postId) => {
    navigate(`/forum/post/${postId}`);
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!profileData) {
    return (
      <ProfileContainer>
        <EmptyState>
          <h2>Profile not found</h2>
          <p>The requested profile could not be found.</p>
        </EmptyState>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <ProfileHeader>
        <AvatarContainer>
          <Avatar>
            <AvatarImg 
              src={profileData.profilePicture || '/default-avatar.png'} 
              alt={profileData.username} 
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          </Avatar>
          {isOwnProfile && (
            <>
              <EditAvatarButton htmlFor="avatarUpload">
                <FaEdit />
              </EditAvatarButton>
              <AvatarInput
                type="file"
                id="avatarUpload"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </>
          )}
        </AvatarContainer>
        
        <ProfileInfo>
          <ProfileName>
            {profileData.username}
            {profileData.isAdministrator && <AdminBadge>Admin</AdminBadge>}
            {!profileData.isAdministrator && profileData.role === 'moderator' && (
              <ModeratorBadge>Moderator</ModeratorBadge>
            )}
          </ProfileName>
          
          <ProfileMeta>
            <MetaItem>
              <FaCalendarAlt />
              Joined {formatDate(profileData.createdAt)}
            </MetaItem>
            {profileData.email && (
              <MetaItem>
                <FaEnvelope />
                {profileData.email}
              </MetaItem>
            )}
          </ProfileMeta>
          
          <ProfileBio>
            {profileData.bio || 'No bio provided.'}
          </ProfileBio>
          
          {isOwnProfile && (
            <EditButton
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openEditModal}
            >
              <FaUserEdit /> Edit Profile
            </EditButton>
          )}
        </ProfileInfo>
      </ProfileHeader>
      
      <ProfileTabs>
        <TabList>
          <Tab 
            active={activeTab === 'bots'} 
            onClick={() => handleTabChange('bots')}
          >
            Bots
          </Tab>
          <Tab 
            active={activeTab === 'posts'} 
            onClick={() => handleTabChange('posts')}
          >
            Forum Posts
          </Tab>
          <Tab 
            active={activeTab === 'comments'} 
            onClick={() => handleTabChange('comments')}
          >
            Comments
          </Tab>
          {isOwnProfile && (
            <Tab 
              active={activeTab === 'settings'} 
              onClick={() => handleTabChange('settings')}
            >
              Settings
            </Tab>
          )}
        </TabList>
        
        <TabContent>
          {activeTab === 'bots' && (
            <BotsList>
              {profileData.bots && profileData.bots.length > 0 ? (
                profileData.bots.map((bot) => (
                  <BotCard key={bot._id}>
                    <BotTitle>{bot.name}</BotTitle>
                    <BotServer>{bot.serverIP}</BotServer>
                    <BotStatus status={bot.status || 'offline'}>
                      {bot.status || 'Offline'}
                    </BotStatus>
                    
                    <BotActions>
                      <BotActionButton 
                        onClick={() => navigateToBot(bot._id)}
                        title="Manage Bot"
                      >
                        <FaRobot />
                      </BotActionButton>
                      {isOwnProfile && (
                        <>
                          <BotActionButton 
                            onClick={() => navigate(`/edit-bot/${bot._id}`)}
                            color="#6c63ff"
                            title="Edit Bot"
                          >
                            <FaEdit />
                          </BotActionButton>
                          <BotActionButton 
                            color="#f44336"
                            title="Delete Bot"
                          >
                            <FaTrash />
                          </BotActionButton>
                        </>
                      )}
                    </BotActions>
                  </BotCard>
                ))
              ) : (
                <EmptyState style={{ gridColumn: '1 / -1' }}>
                  <h3>No bots found</h3>
                  <p>
                    {isOwnProfile 
                      ? "You haven't created any bots yet." 
                      : "This user hasn't created any bots yet."}
                  </p>
                  {isOwnProfile && (
                    <EditButton
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/create-bot')}
                      style={{ marginTop: '1rem' }}
                    >
                      <FaRobot /> Create a Bot
                    </EditButton>
                  )}
                </EmptyState>
              )}
            </BotsList>
          )}
          
          {activeTab === 'posts' && (
            <PostsList>
              {profileData.forumPosts && profileData.forumPosts.length > 0 ? (
                profileData.forumPosts.map((post) => (
                  <PostCard key={post._id} onClick={() => navigateToPost(post._id)} style={{ cursor: 'pointer' }}>
                    <PostTitle>{post.title}</PostTitle>
                    <PostMeta>
                      <span><FaCalendarAlt /> {formatDate(post.createdAt)}</span>
                    </PostMeta>
                    <PostStats>
                      <span>❤️ {post.likes?.length || 0} likes</span>
                      <span>💬 {post.comments?.length || 0} comments</span>
                    </PostStats>
                  </PostCard>
                ))
              ) : (
                <EmptyState>
                  <h3>No forum posts found</h3>
                  <p>
                    {isOwnProfile 
                      ? "You haven't created any forum posts yet." 
                      : "This user hasn't created any forum posts yet."}
                  </p>
                  {isOwnProfile && (
                    <EditButton
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate('/forum/create')}
                      style={{ marginTop: '1rem' }}
                    >
                      <FaEdit /> Create a Post
                    </EditButton>
                  )}
                </EmptyState>
              )}
            </PostsList>
          )}
          
          {activeTab === 'comments' && (
            <EmptyState>
              <h3>Comments</h3>
              <p>Coming soon - user comments will be displayed here.</p>
            </EmptyState>
          )}
          
          {activeTab === 'settings' && isOwnProfile && (
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Account Settings</h3>
              
              <EditButton
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openEditModal}
                style={{ marginRight: '1rem' }}
              >
                <FaUserEdit /> Edit Profile
              </EditButton>
              
              <EditButton
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/change-password')}
                style={{ background: '#444' }}
              >
                <FaLock /> Change Password
              </EditButton>
            </div>
          )}
        </TabContent>
      </ProfileTabs>
      
      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeEditModal}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>
              <FaUserEdit /> Edit Profile
            </ModalTitle>
            
            <form onSubmit={handleSubmitEdit}>
              <FormGroup>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormInput
                  type="text"
                  id="username"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditChange}
                  placeholder="Enter your username"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="bio">Bio</FormLabel>
                <FormTextarea
                  id="bio"
                  name="bio"
                  value={editFormData.bio}
                  onChange={handleEditChange}
                  placeholder="Tell us a bit about yourself..."
                />
              </FormGroup>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}
              
              <ModalButtons>
                <CancelButton
                  type="button"
                  onClick={closeEditModal}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Cancel
                </CancelButton>
                <SaveButton
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.03 }}
                  whileTap={{ scale: submitting ? 1 : 0.97 }}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </SaveButton>
              </ModalButtons>
            </form>
          </ModalContent>
        </EditProfileModal>
      )}
    </ProfileContainer>
  );
};

export default Profile;
