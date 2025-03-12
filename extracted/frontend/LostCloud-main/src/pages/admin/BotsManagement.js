
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRobot, FaSearch, FaFilter, FaPlay, FaStop, FaPause, FaCog } from 'react-icons/fa';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: #6c63ff;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.6);
  color: #fff;
  font-size: 0.95rem;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: #6c63ff;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.6);
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(108, 99, 255, 0.1);
    border-color: #6c63ff;
  }
`;

const AddBotButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background: #6c63ff;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5a52d5;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BotCard = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(108, 99, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const BotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BotTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #fff;
`;

const StatusBadge = styled.span`
  background: ${props => 
    props.status === 'online' ? 'rgba(46, 213, 115, 0.2)' : 
    props.status === 'offline' ? 'rgba(235, 77, 75, 0.2)' : 
    'rgba(255, 204, 0, 0.2)'};
  color: ${props => 
    props.status === 'online' ? '#2ed573' : 
    props.status === 'offline' ? '#eb4d4b' : 
    '#ffcc00'};
  font-size: 0.85rem;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-weight: 500;
`;

const BotDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  width: 120px;
  color: #aaa;
`;

const DetailValue = styled.span`
  color: #fff;
  flex: 1;
`;

const BotActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(30, 30, 30, 0.6);
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(108, 99, 255, 0.1);
    border-color: #6c63ff;
    color: #6c63ff;
  }
`;

// Sample bot data
const mockBots = [
  {
    id: '1',
    name: 'ResourceBot',
    server: 'play.example.com',
    status: 'online',
    lastSeen: '2 minutes ago',
    createdAt: '2023-05-10',
    type: 'Miner'
  },
  {
    id: '2',
    name: 'GuardBot',
    server: 'mc.myserver.net',
    status: 'offline',
    lastSeen: '3 hours ago',
    createdAt: '2023-04-22',
    type: 'Guardian'
  },
  {
    id: '3',
    name: 'FarmBot',
    server: 'survival.minecraft.gg',
    status: 'paused',
    lastSeen: '35 minutes ago',
    createdAt: '2023-06-01',
    type: 'Farmer'
  },
  {
    id: '4',
    name: 'ExplorerBot',
    server: 'world.craftmine.org',
    status: 'online',
    lastSeen: 'Just now',
    createdAt: '2023-05-15',
    type: 'Explorer'
  },
  {
    id: '5',
    name: 'BuilderBot',
    server: 'creative.blockcraft.com',
    status: 'paused',
    lastSeen: '1 hour ago',
    createdAt: '2023-03-30',
    type: 'Builder'
  }
];

const BotsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bots, setBots] = useState(mockBots);
  
  // Filter bots based on search term
  const filteredBots = bots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <FaRobot /> Bots Management
        </Title>
        <Controls>
          <SearchBar>
            <FaSearch />
            <SearchInput 
              type="text" 
              placeholder="Search bots..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <FilterButton>
            <FaFilter /> Filter
          </FilterButton>
          <AddBotButton>
            + Add New Bot
          </AddBotButton>
        </Controls>
      </Header>
      
      <Grid
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredBots.map(bot => (
          <BotCard key={bot.id} variants={itemVariants}>
            <BotHeader>
              <BotTitle>{bot.name}</BotTitle>
              <StatusBadge status={bot.status}>
                {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
              </StatusBadge>
            </BotHeader>
            <BotDetails>
              <DetailRow>
                <DetailLabel>Server:</DetailLabel>
                <DetailValue>{bot.server}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Type:</DetailLabel>
                <DetailValue>{bot.type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Last Seen:</DetailLabel>
                <DetailValue>{bot.lastSeen}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Created:</DetailLabel>
                <DetailValue>{bot.createdAt}</DetailValue>
              </DetailRow>
            </BotDetails>
            <BotActions>
              {bot.status !== 'online' && (
                <ActionButton title="Start">
                  <FaPlay />
                </ActionButton>
              )}
              {bot.status === 'online' && (
                <ActionButton title="Pause">
                  <FaPause />
                </ActionButton>
              )}
              <ActionButton title="Stop">
                <FaStop />
              </ActionButton>
              <ActionButton title="Settings">
                <FaCog />
              </ActionButton>
            </BotActions>
          </BotCard>
        ))}
      </Grid>
    </Container>
  );
};

export default BotsManagement;
