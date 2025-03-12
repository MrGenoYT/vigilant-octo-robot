import { createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from './themes';

// Define breakpoints for responsive design
export const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px'
};

// Media query helper
export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
};

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }

  button, .btn {
    cursor: pointer;
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.primaryHover};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.disabled};
      cursor: not-allowed;
    }
  }

  input, textarea, select {
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.text};
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: 4px;
    padding: 0.5rem;
    font-size: 1rem;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
    }
  }

  .card {
    background-color: ${({ theme }) => theme.cardBg};
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  ${media.md} {
    .container {
      padding: 0 0.5rem;
    }
  }
`;

export default GlobalStyles;