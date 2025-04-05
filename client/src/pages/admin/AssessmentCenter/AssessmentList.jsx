<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { Row, Col} from 'react-bootstrap';
=======
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Form, Row, Col, Table, Button, Badge } from 'react-bootstrap';
>>>>>>> Stashed changes
import { FaEdit, FaTrash, FaEye, FaPlus, FaFilter, FaSearch, FaFileExport, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/adminTheme.css';

const AssessmentList = () => {
    const navigate = useNavigate();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filteredAssessments, setFilteredAssessments] = useState([]);

    const mockAssessments = [
        {
            id: '1',
            title: 'JavaScript Fundamentals Quiz',
            type: 'quiz',
            status: 'active',
            courseName: 'JavaScript Basics',
            totalQuestions: 20,
            passingScore: 70,
            duration: 30,
            createdAt: '2025-03-15',
            submissions: 45
        },
        {
            id: '2',
            title: 'React Component Development',
            type: 'coding',
            status: 'active',
            courseName: 'React Fundamentals',
            totalQuestions: 5,
            passingScore: 80,
            duration: 120,
            createdAt: '2025-03-18',
            submissions: 32
        },
        {
            id: '3',
            title: 'Database Design Project',
            type: 'project',
            status: 'active',
            courseName: 'Database Systems',
            totalQuestions: 1,
            passingScore: 60,
            duration: 1440,
            createdAt: '2025-03-20',
            submissions: 28
        },
        {
            id: '4',
            title: 'Python Data Structures',
            type: 'quiz',
            status: 'inactive',
            courseName: 'Python Programming',
            totalQuestions: 15,
            passingScore: 65,
            duration: 45,
            createdAt: '2025-03-21',
            submissions: 0
        },
        {
            id: '5',
            title: 'Full Stack Final Exam',
            type: 'exam',
            status: 'scheduled',
            courseName: 'Full Stack Development',
            totalQuestions: 30,
            passingScore: 75,
            duration: 180,
            createdAt: '2025-03-22',
            submissions: 0
        },
        {
            id: '6',
            title: 'API Integration Challenge',
            type: 'coding',
            status: 'active',
            courseName: 'Backend Development',
            totalQuestions: 3,
            passingScore: 70,
            duration: 90,
            createdAt: '2025-03-23',
            submissions: 18
        },
        {
            id: '7',
            title: 'UI/UX Design Principles',
            type: 'quiz',
            status: 'active',
            courseName: 'Frontend Design',
            totalQuestions: 25,
            passingScore: 60,
            duration: 40,
            createdAt: '2025-03-24',
            submissions: 22
        },
        {
            id: '8',
            title: 'Mobile App Development Project',
            type: 'project',
            status: 'active',
            courseName: 'Mobile Development',
            totalQuestions: 1,
            passingScore: 70,
            duration: 2880,
            createdAt: '2025-03-25',
            submissions: 15
        }
    ];

    const fetchAssessments = useCallback(async () => {
        try {
            setLoading(true);
            // In a real app:
            // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/assessments`);
            // setAssessments(response.data);
            
            // Using mock data for development
            setAssessments(mockAssessments);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch assessments');
            setLoading(false);
        }
    }, []);

    const filterAndSortAssessments = useCallback(() => {
        let filtered = [...assessments];

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(assessment => assessment.type === filterType);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(assessment =>
                assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                assessment.courseName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            if (sortField === 'createdAt') {
                return sortDirection === 'asc' ? 
                    new Date(a.createdAt) - new Date(b.createdAt) :
                    new Date(b.createdAt) - new Date(a.createdAt);
            }
            
            // Handle numeric fields
            if (['totalQuestions', 'duration', 'submissions', 'passingScore'].includes(sortField)) {
                return sortDirection === 'asc' ? 
                    a[sortField] - b[sortField] :
                    b[sortField] - a[sortField];
            }
            
            // Handle string fields
            return sortDirection === 'asc' ?
                String(a[sortField]).localeCompare(String(b[sortField])) :
                String(b[sortField]).localeCompare(String(a[sortField]));
        });

        return filtered;
    }, [assessments, filterType, searchTerm, sortField, sortDirection]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assessment?')) {
            try {
                // In production, use the actual API call
                // await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/assessments/${id}`);
                
                // For development, filter out the deleted assessment
                const updatedAssessments = assessments.filter(assessment => assessment.id !== id);
                setAssessments(updatedAssessments);
            } catch (err) {
                setError('Failed to delete assessment');
            }
        }
    };

    const handleSort = (field) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (field !== sortField) return <FaSort />;
        return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case 'active': return 'admin-badge-success';
            case 'inactive': return 'admin-badge-light';
            case 'scheduled': return 'admin-badge-info';
            default: return 'admin-badge-light';
        }
    };

    const getTypeBadgeClass = (type) => {
        switch(type) {
            case 'quiz': return 'admin-badge-primary';
            case 'coding': return 'admin-badge-warning';
            case 'project': return 'admin-badge-info';
            case 'exam': return 'admin-badge-danger';
            default: return 'admin-badge-light';
        }
    };

    // Update filtered assessments when dependencies change
    useEffect(() => {
        const filtered = filterAndSortAssessments();
        setFilteredAssessments(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [filterAndSortAssessments]);

    // Calculate pagination values
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAssessments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAssessments.length / itemsPerPage);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-card">
                <div className="admin-card-body">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error!</h4>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Assessment Center</h2>
                <div>
                    <button 
                        className="admin-btn admin-btn-success me-2"
                        onClick={() => navigate('/admin/assessments/results')}
                    >
                        <FaEye className="me-2" /> View Results
                    </button>
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={() => navigate('/admin/assessments/create')}
                    >
                        <FaPlus className="me-2" /> Create Assessment
                    </button>
                </div>
            </div>

            <div className="admin-card mb-4">
                <div className="admin-card-header">
                    <h5 className="admin-card-title">Filter Assessments</h5>
                </div>
                <div className="admin-card-body">
                    <Row>
                        <Col md={6} lg={8}>
                            <div className="position-relative mb-3">
                                <FaSearch className="position-absolute" style={{ left: '15px', top: '12px', color: '#64748b' }} />
                                <input
                                    type="text"
                                    className="admin-form-control ps-4"
                                    placeholder="Search by title or course name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col md={6} lg={4}>
                            <div className="position-relative mb-3">
                                <FaFilter className="position-absolute" style={{ left: '15px', top: '12px', color: '#64748b' }} />
                                <select
                                    className="admin-form-select ps-4"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">All Types</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="coding">Coding Assignment</option>
                                    <option value="project">Project</option>
                                    <option value="exam">Final Exam</option>
                                </select>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <span className="text-muted">
                                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredAssessments.length)} of {filteredAssessments.length} assessments
                            </span>
                        </div>
                        <button className="admin-btn admin-btn-outline">
                            <FaFileExport className="me-2" /> Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="admin-card">
                <div className="table-responsive">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('title')}>
                                    Title {getSortIcon('title')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('type')}>
                                    Type {getSortIcon('type')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                                    Status {getSortIcon('status')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('courseName')}>
                                    Course {getSortIcon('courseName')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('totalQuestions')}>
                                    Questions {getSortIcon('totalQuestions')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('duration')}>
                                    Duration {getSortIcon('duration')}
                                </th>
                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('submissions')}>
                                    Submissions {getSortIcon('submissions')}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map(assessment => (
                                    <tr key={assessment.id}>
                                        <td>
                                            <div className="fw-medium">{assessment.title}</div>
                                            <div className="small text-muted">ID: {assessment.id}</div>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${getTypeBadgeClass(assessment.type)}`}>
                                                {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${getStatusBadgeClass(assessment.status)}`}>
                                                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                                            </span>
                                        </td>
                                        <td>{assessment.courseName}</td>
                                        <td>{assessment.totalQuestions}</td>
                                        <td>
                                            {assessment.duration >= 1440 ? 
                                                `${Math.floor(assessment.duration / 1440)} days` : 
                                                `${assessment.duration} mins`
                                            }
                                        </td>
                                        <td>
                                            {assessment.submissions > 0 ? (
                                                <span className="fw-medium">{assessment.submissions}</span>
                                            ) : (
                                                <span className="text-muted">No submissions</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="d-flex">
                                                <button 
                                                    className="admin-btn admin-btn-sm admin-btn-info admin-btn-icon me-1"
                                                    onClick={() => navigate(`/admin/assessments/${assessment.id}`)}
                                                    title="View Details"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button 
                                                    className="admin-btn admin-btn-sm admin-btn-warning admin-btn-icon me-1"
                                                    onClick={() => navigate(`/admin/assessments/${assessment.id}/edit`)}
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    className="admin-btn admin-btn-sm admin-btn-danger admin-btn-icon"
                                                    onClick={() => handleDelete(assessment.id)}
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        No assessments found matching your criteria
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                
                {totalPages > 1 && (
                    <div className="admin-card-footer">
                        <div className="admin-pagination">
                            <button 
                                className={`admin-pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo;
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`admin-pagination-item ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => paginate(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button 
                                className={`admin-pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}
                                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentList;
