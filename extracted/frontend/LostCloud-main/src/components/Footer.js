
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
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCloud, FaDiscord, FaTwitter, FaGithub, FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: rgba(20, 20, 20, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 4rem 2rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 0.8rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1.5rem;
  
  svg {
    color: #6c63ff;
    font-size: 2rem;
  }
`;

const FooterDescription = styled.p`
  color: #aaa;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: #aaa;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #6c63ff;
  }
`;

const FooterTitle = styled.h3`
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const FooterLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #6c63ff;
  }
`;

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 2rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Copyright = styled.div`
  color: #aaa;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  svg {
    color: #ff6b6b;
  }
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const BottomLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #6c63ff;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo to="/">
            <FaCloud /> LostCloud
          </FooterLogo>
          <FooterDescription>
            LostCloud provides the most reliable Minecraft bot deployment platform with advanced features for gamers and server owners. Our platform allows you to deploy custom-named bots with anti-AFK behaviors, auto-reconnect, and more.
          </FooterDescription>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaDiscord />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLinks>
            <FooterLink to="/help">Documentation</FooterLink>
            <FooterLink to="/forum">Community Forum</FooterLink>
            <FooterLink to="/help">API Reference</FooterLink>
            <FooterLink to="/help">Bot Scripts</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Company</FooterTitle>
          <FooterLinks>
            <FooterLink to="/">About Us</FooterLink>
            <FooterLink to="/">Careers</FooterLink>
            <FooterLink to="/">Blog</FooterLink>
            <FooterLink to="/">Contact</FooterLink>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Legal</FooterTitle>
          <FooterLinks>
            <FooterLink to="/">Terms of Service</FooterLink>
            <FooterLink to="/">Privacy Policy</FooterLink>
            <FooterLink to="/">Cookie Policy</FooterLink>
            <FooterLink to="/">GDPR</FooterLink>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>
          © {new Date().getFullYear()} LostCloud. All rights reserved. Made with <FaHeart /> by LostCloud Team
        </Copyright>
        <BottomLinks>
          <BottomLink to="/">Status</BottomLink>
          <BottomLink to="/">Sitemap</BottomLink>
          <BottomLink to="/">Cookies Settings</BottomLink>
        </BottomLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
