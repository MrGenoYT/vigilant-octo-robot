
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
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import styled from 'styled-components';

const RecaptchaWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 15px 0;
`;

/**
 * ReCaptcha component that provides Google reCAPTCHA functionality
 * 
 * @param {function} onVerify - Callback function when verification is successful
 * @param {function} onExpire - Callback function when verification expires
 * @param {string} theme - Theme of the captcha ("light" or "dark")
 */
const ReCaptcha = ({ onVerify, onExpire, theme = "light" }) => {
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Default is Google's test key
  
  return (
    <RecaptchaWrapper>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onVerify}
        onExpired={onExpire}
        theme={theme}
      />
    </RecaptchaWrapper>
  );
};

export default ReCaptcha;
