
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ReportedContent = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReportedContent();
  }, [currentPage]);

  const fetchReportedContent = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/reported-content?page=${currentPage}`);
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reported content:', err);
      setError('Failed to load reported content. Please try again later.');
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/reported-content/${id}/approve`);
      fetchReportedContent();
    } catch (err) {
      console.error('Error approving report:', err);
      setError('Failed to approve report. Please try again.');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await axios.put(`/api/admin/reported-content/${id}/dismiss`);
      fetchReportedContent();
    } catch (err) {
      console.error('Error dismissing report:', err);
      setError('Failed to dismiss report. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <LoadingWrapper>Loading reports...</LoadingWrapper>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <h1>Reported Content</h1>
        <p>Review and moderate reported content</p>
      </Header>

      {reports.length === 0 ? (
        <NoReports>No pending reports to review! 🎉</NoReports>
      ) : (
        <>
          <ReportsList>
            {reports.map((report) => (
              <ReportCard key={report._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReportHeader>
                  <ReportType type={report.contentType}>
                    {report.contentType.toUpperCase()}
                  </ReportType>
                  <ReportDate>
                    {new Date(report.reportedAt).toLocaleDateString()}
                  </ReportDate>
                </ReportHeader>
                
                <ReportContent>
                  <p><strong>Reason:</strong> {report.reason}</p>
                  {report.contentPreview && (
                    <ContentPreview>
                      <strong>Content:</strong> 
                      <p>{report.contentPreview}</p>
                    </ContentPreview>
                  )}
                  <p><strong>Reported by:</strong> {report.reportedBy?.username || 'Unknown'}</p>
                </ReportContent>
                
                <ButtonGroup>
                  <ApproveButton onClick={() => handleApprove(report._id)}>
                    <FaCheckCircle /> Approve
                  </ApproveButton>
                  <DismissButton onClick={() => handleDismiss(report._id)}>
                    <FaTimesCircle /> Dismiss
                  </DismissButton>
                </ButtonGroup>
              </ReportCard>
            ))}
          </ReportsList>

          <Pagination>
            <PaginationButton 
              disabled={currentPage === 1} 
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FaArrowLeft /> Previous
            </PaginationButton>
            <PageInfo>
              Page {currentPage} of {totalPages}
            </PageInfo>
            <PaginationButton 
              disabled={currentPage === totalPages} 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <FaArrowRight />
            </PaginationButton>
          </Pagination>
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: #e53e3e;
  padding: 1rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: center;
`;

const NoReports = styled.div`
  background-color: #f0fff4;
  color: #38a169;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 500;
`;

const ReportsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ReportCard = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const ReportType = styled.span`
  background-color: ${props => {
    switch(props.type) {
      case 'post': return '#3182ce';
      case 'comment': return '#38a169';
      case 'user': return '#e53e3e';
      case 'bot': return '#d69e2e';
      default: return '#718096';
    }
  }};
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const ReportDate = styled.span`
  color: #718096;
  font-size: 0.875rem;
`;

const ReportContent = styled.div`
  padding: 1rem;
  
  p {
    margin-bottom: 0.75rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ContentPreview = styled.div`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 0.75rem;
  margin: 0.5rem 0;
  
  p {
    margin-top: 0.5rem;
    margin-bottom: 0;
    font-style: italic;
    word-break: break-word;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ApproveButton = styled(Button)`
  background-color: #48bb78;
  color: white;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #38a169;
  }
`;

const DismissButton = styled(Button)`
  background-color: #f56565;
  color: white;
  margin-left: 0.5rem;
  
  &:hover {
    background-color: #e53e3e;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => props.disabled ? '#f1f1f1' : '#3182ce'};
  color: ${props => props.disabled ? '#a0aec0' : 'white'};
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  svg {
    margin: ${props => props.children[0].type === FaArrowLeft ? '0 0.5rem 0 0' : '0 0 0 0.5rem'};
  }
  
  &:not(:disabled):hover {
    background-color: #2c5282;
  }
`;

const PageInfo = styled.div`
  margin: 0 1rem;
  color: #4a5568;
`;

export default ReportedContent;
