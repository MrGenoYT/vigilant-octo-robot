import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { FaRobot, FaShieldAlt, FaComments, FaUsersCog } from 'react-icons/fa';
import { useParallax } from 'react-scroll-parallax';
import Hero from '../components/Hero';

// Styled components for the home page
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Section = styled.section`
  padding: 4rem 1rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#333'};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #6c63ff, #3b82f6);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme === 'dark' ? 'rgba(30, 30, 40, 0.5)' : 'rgba(255, 255, 255, 0.9)'};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: #6c63ff;
  display: inline-block;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#333'};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme === 'dark' ? '#b8b8b8' : '#666'};
  line-height: 1.6;
`;

const CTASection = styled.section`
  padding: 6rem 1rem;
  width: 100%;
  background: linear-gradient(135deg, #1e1e2e 0%, #2d2b42 100%);
  text-align: center;
  margin-top: 3rem;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  color: #b8b8b8;
  max-width: 700px;
  margin: 0 auto 2.5rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(90deg, #6c63ff 0%, #3b82f6 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(108, 99, 255, 0.6);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 2rem;
    font-size: 1rem;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 12
    }
  }
};

// Features data
const features = [
  {
    icon: <FaRobot />,
    title: 'Intelligent Bots',
    description: 'Create customizable Minecraft bots that can automate farming, mining, and building tasks with advanced AI capabilities.'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Secure & Reliable',
    description: 'Your bot configurations and server data are encrypted and securely stored, with 99.9% uptime guaranteed.'
  },
  {
    icon: <FaComments />,
    title: 'Community Forum',
    description: 'Connect with other bot creators, share your configurations, and get help from the community when needed.'
  },
  {
    icon: <FaUsersCog />,
    title: 'Team Collaboration',
    description: 'Work together with your team by sharing bots, configurations, and monitoring responsibilities.'
  }
];

function Home() {
  const { ref: featuresRef, inView: featuresInView } = useParallax({ speed: 10 });
  const featuresSectionRef = useRef(null);
  const featuresVisible = useInView(featuresSectionRef, { once: true, threshold: 0.2 });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <HomeContainer>
      {/* Hero section */}
      <Hero />

      {/* Features section */}
      <Section ref={featuresSectionRef}>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={featuresVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          Powerful Features
        </SectionTitle>

        <FeaturesGrid
          ref={featuresRef}
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate={featuresVisible ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              variants={itemVariants}
              theme="dark" // Add your theme logic here
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle theme="dark">{feature.title}</FeatureTitle>
              <FeatureDescription theme="dark">{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* Call to Action section */}
      <CTASection>
        <CTATitle>Ready to Automate Your Minecraft Experience?</CTATitle>
        <CTADescription>
          Join thousands of players who are already using LostCloud to enhance their gameplay with intelligent bots.
        </CTADescription>
        <CTAButton to="/register">Get Started Now</CTAButton>
      </CTASection>
    </HomeContainer>
  );
}

export default Home;