
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 1.8rem;
`;

const ReportedContent = () => {
  return (
    <Container>
      <Title>Reported Content</Title>
      <p>This is a placeholder for the Reported Content page. Implementation will include listing and reviewing content reported by users.</p>
    </Container>
  );
};

export default ReportedContent;
