import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRobot, FaServer, FaTrash, FaEdit, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [bots, setBots] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [botLimit, setBotLimit] = useState(2);
  const [botCount, setBotCount] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    serverIP: '',
    serverType: 'Java',
    serverKey: '',
    captchaToken: ''
  });

  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBot, setDeletingBot] = useState(null);
  const [deleteServerKey, setDeleteServerKey] = useState('');

  // Success/failure messages
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/bots', { withCredentials: true });
      setBots(response.data);
      setBotCount(response.data.length);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bots. Please try again later.');
      setLoading(false);
      console.error('Error fetching bots:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      serverIP: '',
      serverType: 'Java',
      serverKey: '',
      captchaToken: ''
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Execute reCAPTCHA
      const captchaToken = await executeCaptcha();

      const response = await axios.post('/api/bots/create', 
        { ...formData, captchaToken }, 
        { withCredentials: true }
      );

      setMessage({ type: 'success', text: 'Bot created successfully! Save your Server Key: ' + response.data.serverKey });
      resetForm();
      setShowCreateForm(false);
      fetchBots();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to create bot. Please try again later.' 
      });
      console.error('Error creating bot:', err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/api/bots/${editingBot.serverId}`, 
        formData, 
        { withCredentials: true }
      );

      setMessage({ 
        type: 'success', 
        text: 'Bot updated successfully! Your new Server Key: ' + response.data.serverKey 
      });

      resetForm();
      setShowEditForm(false);
      setEditingBot(null);
      fetchBots();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update bot. Please try again later.' 
      });
      console.error('Error updating bot:', err);
    }
  };

  const handleDeleteBot = async () => {
    try {
      await axios.delete(`/api/bots/${deletingBot.serverId}`, {
        data: { serverKey: deleteServerKey },
        withCredentials: true
      });

      setMessage({ type: 'success', text: 'Bot deleted successfully!' });
      setShowDeleteConfirm(false);
      setDeletingBot(null);
      setDeleteServerKey('');
      fetchBots();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to delete bot. Please try again later.' 
      });
      console.error('Error deleting bot:', err);
    }
  };

  const startEdit = (bot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      serverIP: bot.serverIP,
      serverType: bot.serverType,
      serverKey: '',
    });
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const startDelete = (bot) => {
    setDeletingBot(bot);
    setDeleteServerKey('');
    setShowDeleteConfirm(true);
  };

  const executeCaptcha = () => {
    return new Promise((resolve) => {
      // This function would interact with the reCAPTCHA widget
      // For this example, let's just simulate a token
      const token = "simulated-captcha-token";
      resolve(token);
    });
  };

  const closeMessage = () => {
    setMessage({ type: '', text: '' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'green';
      case 'connecting': return 'orange';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bot Dashboard</h1>

      {message.text && (
        <div className={`message-box ${message.type}`}>
          <p>{message.text}</p>
          <button onClick={closeMessage} className="close-button">×</button>
        </div>
      )}

      <div className="dashboard-info">
        <p>Bot Limit: {botCount} / {botLimit}</p>
      </div>

      <div className="dashboard-actions">
        <button 
          className={`action-button ${botCount >= botLimit ? 'disabled' : ''}`}
          onClick={() => {
            if (botCount < botLimit) {
              setShowCreateForm(true);
              setShowEditForm(false);
              resetForm();
            } else {
              setMessage({
                type: 'error',
                text: 'Bot limit reached (2 bots maximum). Please delete an existing bot before creating a new one.'
              });
            }
          }}
          disabled={botCount >= botLimit}
        >
          <FaPlus /> Deploy New Bot
        </button>
      </div>

      {showCreateForm && (
        <div className="form-container">
          <h2>Deploy New Bot</h2>
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
              <label>Bot Name:</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Server IP (with port if needed):</label>
              <input 
                type="text" 
                name="serverIP" 
                value={formData.serverIP} 
                onChange={handleInputChange} 
                placeholder="Example: mc.server.com:25565" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Server Type:</label>
              <select 
                name="serverType" 
                value={formData.serverType} 
                onChange={handleInputChange}
              >
                <option value="Java">Java</option>
                <option value="Bedrock">Bedrock</option>
                <option value="Java+Bedrock">Java+Bedrock</option>
              </select>
            </div>

            <div className="form-group captcha">
              {/* reCAPTCHA would be here */}
              <div className="recaptcha-placeholder">reCAPTCHA Widget</div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">Deploy Bot</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && editingBot && (
        <div className="form-container">
          <h2>Edit Bot: {editingBot.name}</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>Bot Name:</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Server IP (with port if needed):</label>
              <input 
                type="text" 
                name="serverIP" 
                value={formData.serverIP} 
                onChange={handleInputChange} 
                placeholder="Example: mc.server.com:25565" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Server Type:</label>
              <select 
                name="serverType" 
                value={formData.serverType} 
                onChange={handleInputChange}
              >
                <option value="Java">Java</option>
                <option value="Bedrock">Bedrock</option>
                <option value="Java+Bedrock">Java+Bedrock</option>
              </select>
            </div>

            <div className="form-group">
              <label>Server Key (for verification):</label>
              <input 
                type="password" 
                name="serverKey" 
                value={formData.serverKey} 
                onChange={handleInputChange} 
                required 
              />
              <p className="form-help">Enter your server key to confirm this change.</p>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">Update Bot</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setShowEditForm(false);
                  setEditingBot(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showDeleteConfirm && deletingBot && (
        <div className="delete-confirm">
          <h2>Delete Bot: {deletingBot.name}</h2>
          <p>Are you sure you want to delete this bot? This action cannot be undone.</p>

          <div className="form-group">
            <label>Enter Server Key to confirm:</label>
            <input 
              type="password" 
              value={deleteServerKey} 
              onChange={(e) => setDeleteServerKey(e.target.value)} 
              required 
            />
          </div>

          <div className="delete-actions">
            <button 
              onClick={handleDeleteBot} 
              className="delete-confirm-button"
              disabled={!deleteServerKey}
            >
              Delete Bot
            </button>
            <button 
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeletingBot(null);
              }} 
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bots-container">
        <h2>Your Bots</h2>

        {loading ? (
          <div className="loading">Loading your bots...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : bots.length === 0 ? (
          <div className="no-bots">
            <p>You don't have any bots deployed yet.</p>
          </div>
        ) : (
          <div className="bot-cards">
            {bots.map(bot => (
              <div key={bot.serverId} className="bot-card">
                <div className="bot-header">
                  <h3>{bot.name}</h3>
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(bot.status) }}
                    title={`Status: ${bot.status}`}
                  ></div>
                </div>

                <div className="bot-details">
                  <p><FaServer /> Server: {bot.serverIP}</p>
                  <p><FaRobot /> Type: {bot.serverType}</p>
                  <p>ID: {bot.serverId}</p>
                  <p>Created: {new Date(bot.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="bot-actions">
                  <button 
                    onClick={() => startEdit(bot)} 
                    className="edit-button"
                    title="Edit Bot"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button 
                    onClick={() => startDelete(bot)} 
                    className="delete-button"
                    title="Delete Bot"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;