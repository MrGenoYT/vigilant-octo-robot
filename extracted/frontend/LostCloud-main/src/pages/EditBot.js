
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, CircularProgress, Paper, Alert } from '@mui/material';
import axios from 'axios';

const EditBot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '',
    serverKey: ''
  });

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const res = await axios.get(`/api/bots/${id}`);
        setFormData({
          name: res.data.name || '',
          ip: res.data.ip || '',
          port: res.data.port || '',
          serverKey: ''
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bot details');
        setLoading(false);
      }
    };

    fetchBot();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.ip || !formData.serverKey) {
      setError('Bot name, server IP, and server key are required');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`/api/bots/${id}`, formData);
      setSuccess('Bot updated successfully! Your new server key is: ' + res.data.bot.serverKey);
      setLoading(false);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update bot');
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Bot
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Bot Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Server IP"
            name="ip"
            value={formData.ip}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          <TextField
            label="Server Port"
            name="port"
            value={formData.port}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
            helperText="Leave empty for default port (25565)"
          />
          
          <TextField
            label="Server Key"
            name="serverKey"
            value={formData.serverKey}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="password"
            helperText="Enter your server key for verification"
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Bot'}
            </Button>
            
            <Button 
              variant="outlined" 
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditBot;
