import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import axios from 'axios';

const RefundManagement = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for development
  const mockRefundRequests = [
    {
      id: 1,
      requestId: 'REF123456',
      transactionId: 'TXN123456',
      student: 'John Doe',
      course: 'Advanced React Development',
      amount: 99.99,
      reason: 'Course content not as described',
      status: 'pending',
      requestDate: '2025-03-15T10:30:00',
      email: 'john.doe@example.com'
    },
    {
      id: 2,
      requestId: 'REF123457',
      transactionId: 'TXN123459',
      student: 'Jane Smith',
      course: 'Python for Machine Learning',
      amount: 129.99,
      reason: 'Found a better alternative',
      status: 'approved',
      requestDate: '2025-03-10T14:20:00',
      processedDate: '2025-03-12T09:15:00',
      email: 'jane.smith@example.com'
    },
    {
      id: 3,
      requestId: 'REF123458',
      transactionId: 'TXN123460',
      student: 'Michael Johnson',
      course: 'Web Development Bootcamp',
      amount: 199.99,
      reason: 'Technical issues prevented course completion',
      status: 'rejected',
      requestDate: '2025-03-05T09:15:00',
      processedDate: '2025-03-07T11:30:00',
      email: 'michael.johnson@example.com'
    }
  ];

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/payments/refund-requests`);
      // setRefundRequests(response.data);
      
      // Using mock data for development
      setRefundRequests(mockRefundRequests);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch refund requests');
      setLoading(false);
    }
  };

  const handleViewDetails = (request) => {
    setCurrentRequest(request);
    setAdminNotes('');
    setShowModal(true);
  };

  const handleProcessRefund = async (id, approve) => {
    try {
      // In a real app:
      // await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/payments/process-refund/${id}`, {
      //   approved: approve,
      //   adminNotes
      // });
      
      // For development, update the mock data
      const updatedRequests = refundRequests.map(request => {
        if (request.id === id) {
          return {
            ...request,
            status: approve ? 'approved' : 'rejected',
            processedDate: new Date().toISOString(),
            adminNotes
          };
        }
        return request;
      });
      
      setRefundRequests(updatedRequests);
      setShowModal(false);
      
      // Show success message
      alert(`Refund request ${approve ? 'approved' : 'rejected'} successfully`);
    } catch (err) {
      setError(`Failed to ${approve ? 'approve' : 'reject'} refund request`);
    }
  };

  const filteredRequests = refundRequests.filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Refund Requests</h5>
          <Form.Select 
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.requestId}</td>
                    <td>{request.student}</td>
                    <td>{request.course}</td>
                    <td>${request.amount.toFixed(2)}</td>
                    <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No refund requests found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Refund Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRequest && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <p><strong>Request ID:</strong> {currentRequest.requestId}</p>
                  <p><strong>Transaction ID:</strong> {currentRequest.transactionId}</p>
                  <p><strong>Student:</strong> {currentRequest.student}</p>
                  <p><strong>Email:</strong> {currentRequest.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Course:</strong> {currentRequest.course}</p>
                  <p><strong>Amount:</strong> ${currentRequest.amount.toFixed(2)}</p>
                  <p><strong>Request Date:</strong> {new Date(currentRequest.requestDate).toLocaleString()}</p>
                  <p><strong>Status:</strong> {getStatusBadge(currentRequest.status)}</p>
                </Col>
              </Row>
              <div className="mb-3">
                <h6>Reason for Refund:</h6>
                <p className="p-2 bg-light rounded">{currentRequest.reason}</p>
              </div>
              {currentRequest.status === 'pending' && (
                <Form.Group className="mb-3">
                  <Form.Label>Admin Notes:</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this refund request (will be visible to the student)"
                  />
                </Form.Group>
              )}
              {currentRequest.status !== 'pending' && currentRequest.adminNotes && (
                <div className="mb-3">
                  <h6>Admin Notes:</h6>
                  <p className="p-2 bg-light rounded">{currentRequest.adminNotes}</p>
                </div>
              )}
              {currentRequest.processedDate && (
                <p><strong>Processed Date:</strong> {new Date(currentRequest.processedDate).toLocaleString()}</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {currentRequest && currentRequest.status === 'pending' && (
            <>
              <Button 
                variant="danger" 
                onClick={() => handleProcessRefund(currentRequest.id, false)}
              >
                <FaTimes className="me-1" /> Reject Refund
              </Button>
              <Button 
                variant="success" 
                onClick={() => handleProcessRefund(currentRequest.id, true)}
              >
                <FaCheck className="me-1" /> Approve Refund
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RefundManagement;
