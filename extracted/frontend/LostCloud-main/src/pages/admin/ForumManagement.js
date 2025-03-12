
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 1.8rem;
`;

const ForumManagement = () => {
  return (
    <Container>
      <Title>Forum Management</Title>
      <p>This is a placeholder for the Forum Management page. Implementation will include forum post moderation, pinning posts, and managing categories.</p>
    </Container>
  );
};

export default ForumManagement;
