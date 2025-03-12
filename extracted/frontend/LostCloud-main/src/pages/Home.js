
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaRobot, FaComments, FaShieldAlt, FaChartLine, FaServer, FaGamepad, FaLock, FaUsers } from 'react-icons/fa';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';

// Styled Components
const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  overflow: hidden;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3Cpattern id='pattern' width='40' height='40' viewBox='0 0 40 40' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'%3E%3Crect width='100%25' height='100%25' fill='%23FFFFFF' fill-opacity='0'/%3E%3Cpath d='M0 20 L40 20 M20 0 L20 40' stroke='%23FFFFFF' stroke-width='0.5' stroke-opacity='0.07'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E");
    opacity: 0.8;
    z-index: 1;
  }
`;

const AnimatedCircles = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  z-index: 2;

  li {
    position: absolute;
    display: block;
    list-style: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 25s linear infinite;
    bottom: -150px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  text-align: center;
  color: white;
  z-index: 3;
  position: relative;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const HeroButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 2rem;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.25);
    &::after {
      transform: translateX(100%);
    }
  }
`;

const PrimaryButton = styled(HeroButton)`
  background: linear-gradient(45deg, #43c6ac, #191654);
  color: white;

  &:hover {
    background: linear-gradient(45deg, #35a593, #131244);
  }
`;

const SecondaryButton = styled(HeroButton)`
  background: transparent;
  border: 2px solid white;
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FeatureSection = styled.section`
  padding: 8rem 2rem;
  background-color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 3.5rem;
  color: var(--text-color);
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    margin: 1.2rem auto 0;
    border-radius: 2px;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 2rem;
  transition: all 0.4s ease;
  position: relative;
  z-index: 1;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    
    &::before {
      opacity: 0.05;
    }

    ${props => `
      ${FeatureIcon} {
        color: var(--primary-color);
        transform: scale(1.1);
      }
    `}
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1.8rem;
  transition: all 0.3s ease;
  display: inline-block;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-color);
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
  line-height: 1.7;
  font-size: 1.05rem;
`;

const BenefitsSection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow: hidden;
`;

const BenefitRow = styled.div`
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto 6rem;
  gap: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 992px) {
    flex-direction: ${props => props.reverse ? 'column-reverse' : 'column'};
    gap: 2rem;
    margin-bottom: 4rem;
  }
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled(motion.h3)`
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  font-weight: 600;
`;

const BenefitDescription = styled(motion.p)`
  color: var(--text-light);
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const BenefitImage = styled(motion.div)`
  flex: 1;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  perspective: 1000px;
  
  img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const StatsSection = styled.section`
  padding: 5rem 2rem;
  background: var(--primary-color);
  color: white;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatItem = styled(motion.div)`
  padding: 2rem;
`;

const StatNumber = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #ffffff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const TestimonialSection = styled.section`
  padding: 8rem 2rem;
  background-color: white;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0,0,0,0.05), transparent);
  }
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled(motion.div)`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 2.5rem;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: 1.5rem;
    left: 1.5rem;
    font-size: 5rem;
    color: var(--primary-color);
    opacity: 0.1;
    font-family: Georgia, serif;
    line-height: 0;
  }
`;

const TestimonialText = styled.p`
  color: var(--text-color);
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
`;

const AuthorInfo = styled.div``;

const AuthorName = styled.div`
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
`;

const AuthorRole = styled.div`
  font-size: 0.875rem;
  color: var(--text-light);
`;

const CTASection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(135deg, #43c6ac 0%, #191654 100%);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
  }
`;

const CTAContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  line-height: 1.7;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const testimonials = [
  {
    text: "LostCloud transformed how I manage my Minecraft servers. The bot deployment is intuitive and the real-time monitoring helps me keep everything running smoothly.",
    name: "Alex Johnson",
    role: "Server Admin"
  },
  {
    text: "I've tried several management platforms, but LostCloud's security features and helpful community make it stand out. It's a game-changer for Minecraft automation.",
    name: "Sarah Thompson",
    role: "Developer"
  },
  {
    text: "The ease of setting up and managing bots through LostCloud is incredible. The dashboard provides all the information I need at a glance.",
    name: "Michael Chen",
    role: "Minecraft Content Creator"
  }
];

const features = [
  {
    icon: <FaRobot />,
    title: 'Advanced Bot Deployment',
    description: 'Deploy and manage your Minecraft bots with ease. Support for both Java and Bedrock editions with automated setup.'
  },
  {
    icon: <FaComments />,
    title: 'Community Forum',
    description: 'Connect with other users, share your experiences, and get help with our integrated forum system.'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Enterprise-grade Security',
    description: 'Your data is protected with our secure authentication system and encryption protocols at every level.'
  },
  {
    icon: <FaChartLine />,
    title: 'Real-time Monitoring',
    description: 'Monitor your bots in real-time with detailed status updates, performance metrics, and instant alerts.'
  },
  {
    icon: <FaServer />,
    title: 'Scalable Architecture',
    description: 'Easily scale your bot operations from a single bot to hundreds across multiple servers with distributed management.'
  },
  {
    icon: <FaGamepad />,
    title: 'Custom Bot Actions',
    description: 'Create and deploy custom actions and scripts for your bots to automate complex tasks in your Minecraft world.'
  },
  {
    icon: <FaLock />,
    title: 'Permission Controls',
    description: 'Granular access controls let you determine exactly who can view, edit, or manage your deployed bots.'
  },
  {
    icon: <FaUsers />,
    title: 'Team Collaboration',
    description: 'Work together with your team by sharing bots, configurations, and monitoring responsibilities.'
  }
];

function Home() {
  const circleCount = 10;
  const circles = Array.from({ length: circleCount }).map((_, i) => i + 1);

  return (
    <ParallaxProvider>
      <HeroSection>
        <AnimatedCircles>
          {circles.map((i) => (
            <li 
              key={i}
              style={{
                left: `${Math.floor(Math.random() * 90)}%`,
                width: `${Math.floor(Math.random() * 100) + 20}px`,
                height: `${Math.floor(Math.random() * 100) + 20}px`,
                animationDelay: `${(Math.random() * 5)}s`,
                animationDuration: `${(Math.random() * 15) + 5}s`
              }}
            />
          ))}
        </AnimatedCircles>
        
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Manage Your Minecraft Bots with LostCloud
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            A secure and powerful platform for deploying, managing, and monitoring Minecraft bots for your servers.
          </HeroSubtitle>
          <ButtonContainer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          >
            <PrimaryButton to="/register">Get Started</PrimaryButton>
            <SecondaryButton to="/forum">Explore Forum</SecondaryButton>
          </ButtonContainer>
        </HeroContent>
      </HeroSection>

      <FeatureSection>
        <SectionTitle>Why Choose LostCloud?</SectionTitle>
        <FeaturesGrid as={motion.div} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          {features.map((feature, index) => (
            <FeatureCard key={index} variants={itemVariants}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeatureSection>

      <BenefitsSection>
        <SectionTitle>How LostCloud Transforms Your Minecraft Experience</SectionTitle>
        
        <BenefitRow>
          <BenefitContent>
            <BenefitTitle
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              Simplified Bot Management
            </BenefitTitle>
            <BenefitDescription
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              LostCloud takes the complexity out of setting up and managing Minecraft bots. With our intuitive dashboard, you can deploy new bots with just a few clicks, monitor their status in real-time, and manage all your bots from a single interface.
            </BenefitDescription>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <PrimaryButton to="/register" style={{ display: 'inline-flex' }}>Start Managing Bots</PrimaryButton>
            </motion.div>
          </BenefitContent>
          
          <BenefitImage
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Parallax speed={-5}>
              <img src="https://via.placeholder.com/600x400?text=Bot+Management+Dashboard" alt="Dashboard Interface" />
            </Parallax>
          </BenefitImage>
        </BenefitRow>
        
        <BenefitRow reverse>
          <BenefitImage
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Parallax speed={-5}>
              <img src="https://via.placeholder.com/600x400?text=Community+Forums" alt="Community Forum" />
            </Parallax>
          </BenefitImage>
          
          <BenefitContent>
            <BenefitTitle
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              Vibrant Community
            </BenefitTitle>
            <BenefitDescription
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of Minecraft enthusiasts in our community forums. Share your bot configurations, ask for help, discuss best practices, and stay updated with the latest Minecraft bot development techniques.
            </BenefitDescription>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <PrimaryButton to="/forum" style={{ display: 'inline-flex' }}>Join The Discussion</PrimaryButton>
            </motion.div>
          </BenefitContent>
        </BenefitRow>
      </BenefitsSection>

      <StatsSection>
        <StatsGrid>
          <StatItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <StatNumber>10,000+</StatNumber>
            <StatLabel>Active Users</StatLabel>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <StatNumber>50,000+</StatNumber>
            <StatLabel>Bots Deployed</StatLabel>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <StatNumber>99.9%</StatNumber>
            <StatLabel>Uptime</StatLabel>
          </StatItem>
          <StatItem
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <TestimonialSection>
        <SectionTitle>What Our Users Say</SectionTitle>
        <TestimonialGrid>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <TestimonialText>{testimonial.text}</TestimonialText>
              <TestimonialAuthor>
                <AuthorAvatar>{testimonial.name.charAt(0)}</AuthorAvatar>
                <AuthorInfo>
                  <AuthorName>{testimonial.name}</AuthorName>
                  <AuthorRole>{testimonial.role}</AuthorRole>
                </AuthorInfo>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialGrid>
      </TestimonialSection>

      <CTASection>
        <CTAContent
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <CTATitle>Ready to enhance your Minecraft experience?</CTATitle>
          <CTADescription>
            Join thousands of users who are already using LostCloud to manage their Minecraft bots and transform their gaming experience.
          </CTADescription>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <PrimaryButton to="/register" style={{ padding: '1rem 2.5rem', fontSize: '1.25rem' }}>
              Get Started for Free
            </PrimaryButton>
          </motion.div>
        </CTAContent>
      </CTASection>
    </ParallaxProvider>
  );
}

export default Home;
