
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaQuestion, FaBook, FaEnvelope, FaDiscord, FaYoutube, FaRobot, FaSearch } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const HelpContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
`;

const HelpHeader = styled.div`
  background: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #ddd;
  margin-bottom: 1.5rem;
`;

const SearchBar = styled.div`
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  
  &:focus {
    outline: none;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  color: #6c63ff;
  font-size: 1.2rem;
`;

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const HelpCard = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
  
  svg {
    font-size: 1.5rem;
    color: #6c63ff;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #fff;
  margin: 0;
`;

const CardContent = styled.div`
  flex: 1;
`;

const FAQList = styled.div`
  margin-top: 1rem;
`;

const FAQItem = styled.div`
  margin-bottom: 1.2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Question = styled.h3`
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  &:hover {
    color: #6c63ff;
  }
`;

const Answer = styled(motion.div)`
  color: #ccc;
  margin-left: 1.5rem;
  padding: 0.5rem 0;
  border-left: 2px solid #6c63ff;
  padding-left: 1rem;
  font-size: 0.95rem;
`;

const TutorialList = styled.div`
  margin-top: 1rem;
`;

const TutorialItem = styled.div`
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1.2rem;
  
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const TutorialTitle = styled(Link)`
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 0.5rem;
  display: block;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    color: #6c63ff;
  }
`;

const TutorialDescription = styled.p`
  color: #ccc;
  font-size: 0.95rem;
`;

const ContactList = styled.div`
  margin-top: 1rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  svg {
    font-size: 1.2rem;
    color: #6c63ff;
  }
  
  &:hover {
    color: #6c63ff;
  }
`;

const CommandList = styled.div`
  margin-top: 1rem;
`;

const CommandItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CommandName = styled.code`
  background: rgba(0, 0, 0, 0.3);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  color: #6c63ff;
  font-family: monospace;
  font-size: 0.9rem;
  width: 40%;
`;

const CommandDescription = styled.p`
  color: #ccc;
  margin-left: 1rem;
  font-size: 0.95rem;
`;

const YouTubeSection = styled(motion.div)`
  grid-column: 1 / -1;
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const YouTubeTitle = styled.h2`
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const YouTubeDescription = styled.p`
  color: #ddd;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 800px;
`;

const YouTubeButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: #FF0000;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 14px rgba(255, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const Help = () => {
  const [helpData, setHelpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchHelpData = async () => {
      try {
        const response = await axios.get('/api/help');
        setHelpData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching help data:', err);
        setError('Failed to load help resources. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchHelpData();
  }, []);
  
  const toggleQuestion = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };
  
  const filteredFAQ = helpData?.faq.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <HelpContainer>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <h2 style={{ color: '#ff4d4d' }}>{error}</h2>
          <p style={{ color: '#ccc', marginTop: '1rem' }}>
            Please check your connection and try again.
          </p>
        </div>
      </HelpContainer>
    );
  }
  
  return (
    <HelpContainer>
      <HelpHeader>
        <Title>Help Center</Title>
        <Subtitle>
          Find answers to common questions and learn how to get the most out of LostCloud.
        </Subtitle>
        <SearchBar>
          <SearchInput 
            type="text" 
            placeholder="Search for help..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
        </SearchBar>
      </HelpHeader>
      
      <YouTubeSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <YouTubeTitle>
          <FaYoutube color="#FF0000" /> YouTube Channel
        </YouTubeTitle>
        <YouTubeDescription>
          Check out our YouTube channel for video tutorials, announcements, and special events.
          Subscribe for regular updates and learn about new features and tips!
        </YouTubeDescription>
        <YouTubeButton 
          href="https://youtube.com/@itz_geno?si=JzLxCVMZOOofWGsg" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaYoutube /> Visit Our Channel
        </YouTubeButton>
      </YouTubeSection>
      
      <HelpGrid>
        <HelpCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardHeader>
            <FaQuestion />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <FAQList>
              {filteredFAQ?.map((faq, index) => (
                <FAQItem key={index}>
                  <Question onClick={() => toggleQuestion(index)}>
                    {faq.question}
                  </Question>
                  {activeQuestion === index && (
                    <Answer
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {faq.answer}
                    </Answer>
                  )}
                </FAQItem>
              ))}
            </FAQList>
          </CardContent>
        </HelpCard>
        
        <HelpCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CardHeader>
            <FaBook />
            <CardTitle>Tutorials & Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <TutorialList>
              {helpData?.tutorials.map((tutorial, index) => (
                <TutorialItem key={index}>
                  <TutorialTitle to={tutorial.url}>
                    {tutorial.title}
                  </TutorialTitle>
                  <TutorialDescription>
                    {tutorial.description}
                  </TutorialDescription>
                </TutorialItem>
              ))}
            </TutorialList>
          </CardContent>
        </HelpCard>
        
        <HelpCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <CardHeader>
            <FaRobot />
            <CardTitle>Bot Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <CommandList>
              {helpData?.botCommands.map((cmd, index) => (
                <CommandItem key={index}>
                  <CommandName>{cmd.command}</CommandName>
                  <CommandDescription>{cmd.description}</CommandDescription>
                </CommandItem>
              ))}
            </CommandList>
          </CardContent>
        </HelpCard>
        
        <HelpCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ gridColumn: "1 / -1" }}
        >
          <CardHeader>
            <FaEnvelope />
            <CardTitle>Contact & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactList>
              <ContactItem href={`mailto:${helpData?.contact.email}`}>
                <FaEnvelope />
                {helpData?.contact.email}
              </ContactItem>
              <ContactItem href={helpData?.contact.discord} target="_blank" rel="noopener noreferrer">
                <FaDiscord />
                Join our Discord Community
              </ContactItem>
              <ContactItem as={Link} to="/forum/category/Help">
                <FaQuestion />
                Ask on our Help Forum
              </ContactItem>
              <ContactItem href={helpData?.youtube.channel} target="_blank" rel="noopener noreferrer">
                <FaYoutube />
                Watch Tutorial Videos
              </ContactItem>
            </ContactList>
          </CardContent>
        </HelpCard>
      </HelpGrid>
    </HelpContainer>
  );
};

export default Help;
