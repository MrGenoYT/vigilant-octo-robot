import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { io } from 'socket.io-client';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const BotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.borderColor};
`;

const Title = styled.h1`
  margin: 0;
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => props.online ? props.theme.success : props.theme.danger};
  color: white;
`;

const BotInfo = styled.div`
  background-color: ${props => props.theme.cardBg};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
`;

const InfoItem = styled.div`
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: ${props => props.theme.secondary};
`;

const Value = styled.div`
  padding: 8px 10px;
  background-color: ${props => props.theme.inputBg};
  border-radius: 4px;
  font-family: monospace;
  overflow-x: auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;

  &.primary {
    background-color: ${props => props.theme.primary};
    color: white;
  }

  &.danger {
    background-color: ${props => props.theme.danger};
    color: white;
  }

  &.secondary {
    background-color: ${props => props.theme.secondary};
    color: white;
  }

  &:disabled {
    background-color: ${props => props.theme.disabled};
    cursor: not-allowed;
  }
`;

const Console = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
  height: 300px;
  overflow-y: auto;
  font-family: monospace;
  color: #e0e0e0;
  margin-top: 20px;
`;

const LogEntry = styled.div`
  margin-bottom: 5px;

  &.info {
    color: #4fc3f7;
  }

  &.warning {
    color: #ffb74d;
  }

  &.error {
    color: #ef5350;
  }

  &.success {
    color: #81c784;
  }
`;

const CommandInput = styled.div`
  display: flex;
  margin-top: 10px;
  gap: 10px;

  input {
    flex: 1;
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid ${props => props.theme.borderColor};
    background-color: ${props => props.theme.inputBg};
    color: ${props => props.theme.text};
  }

  button {
    padding: 8px 15px;
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      background-color: ${props => props.theme.disabled};
      cursor: not-allowed;
    }
  }
`;

const BotDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [online, setOnline] = useState(false);
  const [logs, setLogs] = useState([]);
  const [command, setCommand] = useState('');
  const consoleRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        const response = await axios.get(`/api/bots/${id}`);
        setBot(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch bot details');
        setLoading(false);
      }
    };

    fetchBotDetails();

    // Setup Socket.io connection
    const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      addLog('info', 'Connected to server');

      // Authenticate with server
      if (user?.token) {
        socket.emit('authenticate', user.token);
      }

      // Join bot room
      socket.emit('join-bot', id);
    });

    socket.on('authenticated', (status) => {
      if (status) {
        addLog('success', 'Authentication successful');
      } else {
        addLog('error', 'Authentication failed');
      }
    });

    socket.on('bot-status', (status) => {
      setOnline(status.online);
      addLog('info', `Bot status: ${status.online ? 'Online' : 'Offline'}`);
    });

    socket.on('bot-log', (log) => {
      addLog(log.type || 'info', log.message);
    });

    socket.on('bot-response', (response) => {
      addLog(response.success ? 'success' : 'error', response.message);
    });

    socket.on('disconnect', () => {
      addLog('warning', 'Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
  }, [id, user]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { type, message, timestamp }]);
  };

  const handleStartBot = async () => {
    try {
      await axios.post(`/api/bots/${id}/start`);
      addLog('info', 'Starting bot...');
    } catch (err) {
      addLog('error', err.response?.data?.message || 'Failed to start bot');
    }
  };

  const handleStopBot = async () => {
    try {
      await axios.post(`/api/bots/${id}/stop`);
      addLog('info', 'Stopping bot...');
    } catch (err) {
      addLog('error', err.response?.data?.message || 'Failed to stop bot');
    }
  };

  const handleDeleteBot = async () => {
    if (window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/bots/${id}`);
        addLog('success', 'Bot deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        addLog('error', err.response?.data?.message || 'Failed to delete bot');
      }
    }
  };

  const handleEditBot = () => {
    navigate(`/bots/${id}/edit`);
  };

  const handleSendCommand = () => {
    if (!command.trim()) return;

    addLog('info', `> ${command}`);
    socketRef.current.emit('bot-command', {
      botId: id,
      command: command,
    });

    setCommand('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bot) {
    return <div>Bot not found</div>;
  }

  return (
    <Container>
      <BotHeader>
        <Title>{bot.name}</Title>
        <StatusBadge online={online}>{online ? 'Online' : 'Offline'}</StatusBadge>
      </BotHeader>

      <BotInfo>
        <InfoItem>
          <Label>Bot ID</Label>
          <Value>{bot._id}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Server Address</Label>
          <Value>{bot.serverAddress}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Server Port</Label>
          <Value>{bot.serverPort || '25565'}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Created</Label>
          <Value>{new Date(bot.createdAt).toLocaleString()}</Value>
        </InfoItem>
      </BotInfo>

      <ButtonGroup>
        <Button className="primary" onClick={handleStartBot} disabled={online}>
          Start Bot
        </Button>
        <Button className="secondary" onClick={handleStopBot} disabled={!online}>
          Stop Bot
        </Button>
        <Button className="primary" onClick={handleEditBot}>
          Edit Bot
        </Button>
        <Button className="danger" onClick={handleDeleteBot}>
          Delete Bot
        </Button>
      </ButtonGroup>

      <Console ref={consoleRef}>
        {logs.map((log, index) => (
          <LogEntry key={index} className={log.type}>
            [{log.timestamp}] {log.message}
          </LogEntry>
        ))}
      </Console>

      <CommandInput>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
          onKeyDown={(e) => e.key === 'Enter' && handleSendCommand()}
          disabled={!online}
        />
        <button onClick={handleSendCommand} disabled={!online || !command.trim()}>
          Send
        </button>
      </CommandInput>
    </Container>
  );
};

export default BotDetails;