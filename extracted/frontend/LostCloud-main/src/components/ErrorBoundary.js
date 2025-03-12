
import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  background-color: ${props => props.theme.cardBackground};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: ${props => props.theme.textPrimary};
`;

const ErrorHeading = styled.h2`
  color: #e74c3c;
  margin-bottom: 15px;
`;

const ErrorMessage = styled.p`
  margin-bottom: 15px;
  font-size: 16px;
`;

const ErrorButton = styled.button`
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #2980b9;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorHeading>Something went wrong</ErrorHeading>
          <ErrorMessage>
            We're sorry, but an error occurred. Please try refreshing the page or contact support if the problem persists.
          </ErrorMessage>
          <ErrorButton onClick={() => window.location.reload()}>
            Refresh Page
          </ErrorButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
