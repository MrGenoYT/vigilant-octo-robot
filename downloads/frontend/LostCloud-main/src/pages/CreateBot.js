import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaServer, FaRobot, FaArrowLeft, FaCog, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const BackLink = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Card = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Description = styled.p`
  color: var(--text-light);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(78, 84, 200, 0.1);
    outline: none;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(78, 84, 200, 0.1);
    outline: none;
  }
`;


const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled(motion.button)`
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.primary {
    background-color: var(--primary-color);
    color: white;
  }

  &.secondary {
    background-color: #f0f0f0;
    color: var(--text-color);
  }
`;

const AdvancedSettings = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e0e0e0;
  padding-top: 1.5rem;
`;

const AdvancedTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const Checkbox = styled.input`
  margin-right: 0.75rem;
`;

const InfoBox = styled.div`
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
  padding: 1rem;
  margin: 1.5rem 0;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const SuccessBox = styled(motion.div)`
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  text-align: center;
`;

const KeyDisplay = styled.div`
  background-color: #f8f9fa;
  border: 1px dashed #d0d7de;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: monospace;
  font-size: 1rem;
  word-break: break-all;
`;

const SuccessHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #52c41a;
`;

function CreateBot() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: 25565,
    serverType: 'Java', // Added serverType
    autoReconnect: true,
    antiAfk: false,
    pathfinding: false,
    logging: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdBot, setCreatedBot] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bots`,
        formData,
        { withCredentials: true }
      );

      setCreatedBot(response.data);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create bot';
      setError(errorMessage);

      // Show more helpful message if user reached bot limit
      if (errorMessage.includes('limit')) {
        setError('You have reached your limit of 2 bots. Please delete an existing bot before creating a new one.');
      }

      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <BackLink
        onClick={() => navigate('/dashboard')}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft /> Back to Dashboard
      </BackLink>

      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!success ? (
          <>
            <Title><FaRobot /> Deploy New Bot</Title>
            <Description>
              Create a new Minecraft bot that will stay online and maintain your presence on the server.
            </Description>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: '#fff2f0',
                  color: '#ff4d4f',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaExclamationTriangle /> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel htmlFor="name">Bot Name</FormLabel>
                <FormInput
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., MyMinecraftBot"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="ip">Server IP Address</FormLabel>
                <FormInput
                  type="text"
                  id="ip"
                  name="ip"
                  value={formData.ip}
                  onChange={handleChange}
                  placeholder="e.g., mc.hypixel.net"
                  required
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="port">Server Port (Default: 25565)</FormLabel>
                <FormInput
                  type="number"
                  id="port"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="25565"
                  min="1"
                  max="65535"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="serverType">Server Type</FormLabel>
                <FormSelect
                  id="serverType"
                  name="serverType"
                  value={formData.serverType}
                  onChange={handleChange}
                >
                  <option value="Java">Java</option>
                  <option value="Bedrock">Bedrock</option>
                  <option value="Java+Bedrock">Java+Bedrock</option>
                </FormSelect>
              </FormGroup>

              <InfoBox>
                <FaInfoCircle style={{ marginRight: '0.5rem' }} />
                Make sure your Minecraft server has "online-mode=false" set in server.properties if you want LostCloud bots to connect.
              </InfoBox>

              <AdvancedSettings>
                <AdvancedTitle>
                  <FaCog /> Advanced Settings
                </AdvancedTitle>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="autoReconnect"
                    name="autoReconnect"
                    checked={formData.autoReconnect}
                    onChange={handleChange}
                  />
                  <FormLabel htmlFor="autoReconnect" style={{ margin: 0 }}>
                    Auto-reconnect if disconnected
                  </FormLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="antiAfk"
                    name="antiAfk"
                    checked={formData.antiAfk}
                    onChange={handleChange}
                  />
                  <FormLabel htmlFor="antiAfk" style={{ margin: 0 }}>
                    Anti-AFK (periodically move to prevent timeouts)
                  </FormLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="pathfinding"
                    name="pathfinding"
                    checked={formData.pathfinding}
                    onChange={handleChange}
                  />
                  <FormLabel htmlFor="pathfinding" style={{ margin: 0 }}>
                    Enable pathfinding capabilities
                  </FormLabel>
                </CheckboxGroup>

                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="logging"
                    name="logging"
                    checked={formData.logging}
                    onChange={handleChange}
                  />
                  <FormLabel htmlFor="logging" style={{ margin: 0 }}>
                    Enable detailed logging
                  </FormLabel>
                </CheckboxGroup>
              </AdvancedSettings>

              <ButtonGroup>
                <Button
                  className="secondary"
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </Button>
                <Button
                  className="primary"
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Deploy Bot
                </Button>
              </ButtonGroup>
            </form>
          </>
        ) : (
          <SuccessBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SuccessHeader>
              <FaCheckCircle /> Bot Successfully Deployed!
            </SuccessHeader>

            <p>Your bot is now active and will maintain your presence on the server.</p>

            <div style={{ margin: '1.5rem 0' }}>
              <p><strong>Server ID:</strong></p>
              <KeyDisplay>
                {createdBot?.serverId}
              </KeyDisplay>

              <p><strong>Server Key (Save this somewhere safe!):</strong></p>
              <KeyDisplay>
                {createdBot?.serverKey}
              </KeyDisplay>

              <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                This server key will only be shown once and is required to delete the bot later.
              </p>
            </div>

            <Button
              className="primary"
              onClick={handleGoToDashboard}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ margin: '0 auto', display: 'flex' }}
            >
              Go to Dashboard
            </Button>
          </SuccessBox>
        )}
      </Card>
    </Container>
  );
}

export default CreateBot;