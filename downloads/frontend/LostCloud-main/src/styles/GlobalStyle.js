
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  :root {
    --primary-color: ${props => props.theme.primaryColor};
    --secondary-color: ${props => props.theme.secondaryColor};
    --background-color: ${props => props.theme.backgroundColor};
    --text-color: ${props => props.theme.textColor};
    --text-light: ${props => props.theme.textSecondary};
    --card-bg: ${props => props.theme.cardBackground};
    --border-color: ${props => props.theme.borderColor};
    --surface: ${props => props.theme.surface};
    --primary-dark: #5550d3;
    --error-color: ${props => props.theme.error};
    --success-color: ${props => props.theme.success};
    --warning-color: ${props => props.theme.warning};
    --info-color: ${props => props.theme.info};
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
    line-height: 1.6;
    transition: background-color 0.2s ease, color 0.2s ease;
    min-height: 100vh;
  }
  
  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
  }
  
  a {
    text-decoration: none;
    color: var(--primary-color);
  }
  
  button {
    cursor: pointer;
    border: none;
    outline: none;
  }
  
  input, textarea, select {
    font-family: inherit;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 1rem;
  }
  
  img {
    max-width: 100%;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.surface};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.borderColor};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.textSecondary};
  }
  
  /* Toast notifications */
  .toast-container {
    z-index: 9999;
  }
  
  /* Form elements styling */
  input, 
  textarea, 
  select {
    padding: 0.8rem;
    border: 1px solid ${props => props.theme.borderColor};
    border-radius: 4px;
    font-size: 1rem;
    background-color: ${props => props.theme.surface};
    color: ${props => props.theme.textColor};
    transition: border-color 0.2s ease;
    
    &:focus {
      border-color: var(--primary-color);
      outline: none;
    }
  }
  
  /* Button styles */
  .btn {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    text-align: center;
    transition: all 0.2s ease;
    font-size: 1rem;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover:not(:disabled) {
      background-color: var(--primary-dark);
    }
  }
  
  .btn-secondary {
    background-color: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    
    &:hover:not(:disabled) {
      background-color: var(--primary-color);
      color: white;
    }
  }
  
  .btn-danger {
    background-color: var(--error-color);
    color: white;
    
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
  
  /* Card styles */
  .card {
    background-color: ${props => props.theme.cardBackground};
    border-radius: 8px;
    box-shadow: 0 2px 10px ${props => props.theme.shadow};
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  /* Helper classes */
  .text-center {
    text-align: center;
  }
  
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .mt-3 { margin-top: 1.5rem; }
  .mt-4 { margin-top: 2rem; }
  .mt-5 { margin-top: 2.5rem; }
  
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mb-4 { margin-bottom: 2rem; }
  .mb-5 { margin-bottom: 2.5rem; }
  
  /* Animation classes */
  .fade-in {
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export default GlobalStyle;
