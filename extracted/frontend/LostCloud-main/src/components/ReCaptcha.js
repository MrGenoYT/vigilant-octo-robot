
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const RecaptchaContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ReCaptcha = ({ onVerify, onExpire }) => {
  const captchaRef = useRef(null);
  
  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    const loadReCaptcha = () => {
      if (window.grecaptcha && captchaRef.current) {
        try {
          window.grecaptcha.render(captchaRef.current, {
            sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
            callback: onVerify,
            'expired-callback': onExpire
          });
        } catch (error) {
          console.error('reCAPTCHA initialization error:', error);
        }
      } else {
        // If not ready yet, try again in 100ms
        setTimeout(loadReCaptcha, 100);
      }
    };

    // Start loading reCAPTCHA after a short delay to ensure DOM is ready
    const timer = setTimeout(loadReCaptcha, 100);
    
    return () => clearTimeout(timer);
  }, [onVerify, onExpire]);

  return (
    <RecaptchaContainer>
      <div ref={captchaRef}></div>
    </RecaptchaContainer>
  );
};

export default ReCaptcha;
