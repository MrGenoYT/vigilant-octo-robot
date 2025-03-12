
import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a1a2e;
  color: #f0f0f0;
  padding: 2rem 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: white;
`;

const FooterLink = styled(Link)`
  color: #b8b8b8;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const ExternalLink = styled.a`
  color: #b8b8b8;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  img {
    height: 40px;
    margin-right: 0.5rem;
  }
  
  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }
`;

const FooterDescription = styled.p`
  color: #b8b8b8;
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: #b8b8b8;
  font-size: 1.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: white;
  }
`;

const BottomBar = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #333344;
  text-align: center;
  color: #b8b8b8;
  font-size: 0.9rem;
`;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>
            <img src="/logo.png" alt="LostCloud Logo" />
            <span>LostCloud</span>
          </FooterLogo>
          <FooterDescription>
            A secure bot and forum management system for Minecraft servers.
          </FooterDescription>
          <SocialLinks>
            <SocialIcon href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href="https://discord.com" target="_blank" rel="noopener noreferrer">
              <FaDiscord />
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Navigation</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/dashboard">Dashboard</FooterLink>
          <FooterLink to="/forum">Forum</FooterLink>
          <FooterLink to="/create-bot">Create Bot</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Account</FooterTitle>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Sign Up</FooterLink>
          <FooterLink to="/profile">Profile</FooterLink>
          <FooterLink to="/forgot-password">Forgot Password</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <ExternalLink href="https://docs.lostcloud.com" target="_blank" rel="noopener noreferrer">
            Documentation
          </ExternalLink>
          <ExternalLink href="https://api.lostcloud.com" target="_blank" rel="noopener noreferrer">
            API Reference
          </ExternalLink>
          <ExternalLink href="https://status.lostcloud.com" target="_blank" rel="noopener noreferrer">
            Status Page
          </ExternalLink>
          <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
          <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
        </FooterSection>
      </FooterContent>

      <BottomBar>
        <p>&copy; {currentYear} LostCloud. All rights reserved.</p>
      </BottomBar>
    </FooterContainer>
  );
}

export default Footer;
