
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const GoogleAuthContext = createContext();

export const GoogleAuthProvider = ({ children }) => {
  const [isGoogleInitialized, setIsGoogleInitialized] = useState(false);
  const { login } = useContext(AuthContext);

  useEffect(() => {
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleAuth;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (window.google && !isGoogleInitialized) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      setIsGoogleInitialized(true);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      // Send the ID token to your backend
      const res = await axios.post('/api/auth/google', {
        token: response.credential,
      });

      // If successful, login the user
      if (res.data.token) {
        login(res.data.token, res.data.user);
      }
    } catch (error) {
      console.error('Google authentication error:', error);
    }
  };

  const renderGoogleButton = (elementId) => {
    if (isGoogleInitialized && window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        }
      );
    }
  };

  return (
    <GoogleAuthContext.Provider value={{ isGoogleInitialized, renderGoogleButton }}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export default GoogleAuthProvider;
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GoogleAuthContext = createContext();

export const useGoogleAuth = () => {
  return useContext(GoogleAuthContext);
};

export const GoogleAuthProvider = ({ children }) => {
  const { login } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Google Sign-In API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      // Cleanup if needed
      const scriptTag = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptTag) {
        document.body.removeChild(scriptTag);
      }
    };
  }, []);

  const initializeGoogleButton = (buttonId, onSuccess) => {
    if (!isScriptLoaded || !window.google) return;

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            // Send ID token to backend
            const result = await axios.post('/api/auth/google', {
              token: response.credential,
            });
            
            if (result.data && result.data.token) {
              login(result.data.token, result.data.user);
              if (onSuccess) onSuccess();
            }
          } catch (error) {
            console.error('Google authentication error:', error);
          }
        },
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        document.getElementById(buttonId),
        {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: '100%',
        }
      );
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error);
    }
  };

  const value = {
    isScriptLoaded,
    initializeGoogleButton,
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
};
