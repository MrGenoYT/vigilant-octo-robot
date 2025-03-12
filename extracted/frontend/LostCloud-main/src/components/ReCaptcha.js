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