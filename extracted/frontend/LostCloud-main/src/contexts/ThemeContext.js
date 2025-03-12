
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark mode
  });

  // Effect to update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    // Update document body class for global styling
    document.body.classList.toggle('dark-mode', darkMode);
    document.body.classList.toggle('light-mode', !darkMode);
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Theme values
  const theme = {
    isDark: darkMode,
    toggleTheme,
    colors: darkMode ? {
      background: '#121212',
      surface: '#1e1e1e',
      primary: '#bb86fc',
      secondary: '#03dac6',
      error: '#cf6679',
      onBackground: '#ffffff',
      onSurface: '#ffffff',
      onPrimary: '#000000',
      onSecondary: '#000000',
      onError: '#000000',
    } : {
      background: '#ffffff',
      surface: '#f5f5f5',
      primary: '#6200ee',
      secondary: '#03dac6',
      error: '#b00020',
      onBackground: '#000000',
      onSurface: '#000000',
      onPrimary: '#ffffff',
      onSecondary: '#000000',
      onError: '#ffffff',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
