
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaFlag, FaTrash, FaCheck, FaEye } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 1.8rem;
`;

const ReportCard = styled.div`
  background: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ReportType = styled.span`
  background: ${props => props.theme.primaryColor};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const ReportDate = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const ReportContent = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  background: ${props => props.theme.surface};
  border-radius: 4px;
  border-left: 3px solid ${props => props.theme.primaryColor};
`;

const ReportReason = styled.p`
  font-style: italic;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ViewButton = styled(ActionButton)`
  background: ${props => props.theme.info};
  color: white;
`;

const ApproveButton = styled(ActionButton)`
  background: ${props => props.theme.success};
  color: white;
`;

const DismissButton = styled(ActionButton)`
  background: ${props => props.theme.warning};
  color: white;
`;

const DeleteButton = styled(ActionButton)`
  background: ${props => props.theme.error};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${props => props.theme.textSecondary};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.borderColor};
  background: ${props => props.active ? props.theme.primaryColor : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.textColor};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? props.theme.primaryColor : props.theme.borderColor};
  }
`;

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/reported-content/${id}`);
        fetchReportedContent();
      } catch (err) {
        console.error('Error deleting reported content:', err);
        setError('Failed to delete content. Please try again.');
      }
    }
  };

  const handleViewContent = (id, type) => {
    // Navigate to the relevant content
    window.open(`/view/${type}/${id}`, '_blank');
  };

  if (loading) return <Container><p>Loading reported content...</p></Container>;
  if (error) return <Container><p>Error: {error}</p></Container>;

  return (
    <Container>
      <Title>Reported Content</Title>
      
      {reports.length === 0 ? (
        <EmptyState>
          <FaFlag size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
          <p>No reported content to review at this time.</p>
        </EmptyState>
      ) : (
        <>
          {reports.map(report => (
            <ReportCard key={report._id}>
              <ReportHeader>
                <ReportType>{report.contentType}</ReportType>
                <ReportDate>{new Date(report.reportedAt).toLocaleString()}</ReportDate>
              </ReportHeader>
              
              <ReportContent>
                {report.contentPreview || 'Content preview not available'}
              </ReportContent>
              
              <ReportReason>
                <strong>Reason:</strong> {report.reason}
              </ReportReason>
              
              <ReportReason>
                <strong>Reported by:</strong> {report.reportedBy.username}
              </ReportReason>
              
              <ButtonGroup>
                <ViewButton onClick={() => handleViewContent(report.contentId, report.contentType)}>
                  <FaEye /> View
                </ViewButton>
                <ApproveButton onClick={() => handleApprove(report._id)}>
                  <FaCheck /> Approve Report
                </ApproveButton>
                <DismissButton onClick={() => handleDismiss(report._id)}>
                  <FaFlag /> Dismiss
                </DismissButton>
                <DeleteButton onClick={() => handleDelete(report.contentId)}>
                  <FaTrash /> Delete Content
                </DeleteButton>
              </ButtonGroup>
            </ReportCard>
          ))}
          
          <Pagination>
            {[...Array(totalPages).keys()].map(page => (
              <PageButton 
                key={page + 1}
                active={currentPage === page + 1}
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </PageButton>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default ReportedContent;
