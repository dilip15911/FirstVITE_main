import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaDownload, FaSearch, FaEye, FaFilter, FaChartBar, FaUserGraduate, FaTrophy, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import '../../../styles/adminTheme.css';
import '../../../utils/chartConfig';

// Register ChartJS components is now handled in chartConfig.js

const AssessmentResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const assessmentId = queryParams.get('assessmentId');

    const [results, setResults] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessment, setSelectedAssessment] = useState(assessmentId || '');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('submittedAt');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [stats, setStats] = useState({
        averageScore: 0,
        passRate: 0,
        totalSubmissions: 0,
        scoreDistribution: []
    });

    useEffect(() => {
        fetchAssessments();
        if (selectedAssessment) {
            fetchResults(selectedAssessment);
        } else {
            setLoading(false);
        }
    }, [selectedAssessment]);

    const fetchAssessments = async () => {
        try {
            // In production, use the actual API call
            // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/assessments`);
            // setAssessments(response.data);
            
            // Mock data for development
            setAssessments([
                { id: '1', title: 'JavaScript Fundamentals Quiz' },
                { id: '2', title: 'React Component Development' },
                { id: '3', title: 'Database Design Project' },
                { id: '4', title: 'Python Data Structures' },
                { id: '5', title: 'Full Stack Final Exam' },
                { id: '6', title: 'API Integration Challenge' },
                { id: '7', title: 'UI/UX Design Principles' },
                { id: '8', title: 'Mobile App Development Project' }
            ]);
        } catch (err) {
            setError('Failed to fetch assessments');
        }
    };

    const fetchResults = async (id) => {
        try {
            setLoading(true);
            
            // In production, use the actual API call
            // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/assessments/${id}/results`);
            // setResults(response.data.results);
            // setStats(response.data.stats);
            
            // Mock data for development
            const mockResults = [
                {
                    id: '1',
                    studentId: 'STU001',
                    studentName: 'John Smith',
                    email: 'john.smith@example.com',
                    score: 85,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-20T14:30:00',
                    timeSpent: 25,
                    totalQuestions: 20,
                    correctAnswers: 17
                },
                {
                    id: '2',
                    studentId: 'STU002',
                    studentName: 'Emily Johnson',
                    email: 'emily.j@example.com',
                    score: 92,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-20T15:15:00',
                    timeSpent: 28,
                    totalQuestions: 20,
                    correctAnswers: 18
                },
                {
                    id: '3',
                    studentId: 'STU003',
                    studentName: 'Michael Brown',
                    email: 'michael.b@example.com',
                    score: 65,
                    passingScore: 70,
                    status: 'fail',
                    submittedAt: '2025-03-20T14:45:00',
                    timeSpent: 30,
                    totalQuestions: 20,
                    correctAnswers: 13
                },
                {
                    id: '4',
                    studentId: 'STU004',
                    studentName: 'Jessica Williams',
                    email: 'jessica.w@example.com',
                    score: 78,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-21T09:30:00',
                    timeSpent: 22,
                    totalQuestions: 20,
                    correctAnswers: 15
                },
                {
                    id: '5',
                    studentId: 'STU005',
                    studentName: 'David Miller',
                    email: 'david.m@example.com',
                    score: 88,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-21T10:15:00',
                    timeSpent: 26,
                    totalQuestions: 20,
                    correctAnswers: 17
                },
                {
                    id: '6',
                    studentId: 'STU006',
                    studentName: 'Sarah Davis',
                    email: 'sarah.d@example.com',
                    score: 60,
                    passingScore: 70,
                    status: 'fail',
                    submittedAt: '2025-03-21T11:00:00',
                    timeSpent: 30,
                    totalQuestions: 20,
                    correctAnswers: 12
                },
                {
                    id: '7',
                    studentId: 'STU007',
                    studentName: 'Robert Wilson',
                    email: 'robert.w@example.com',
                    score: 95,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-22T09:45:00',
                    timeSpent: 24,
                    totalQuestions: 20,
                    correctAnswers: 19
                },
                {
                    id: '8',
                    studentId: 'STU008',
                    studentName: 'Jennifer Taylor',
                    email: 'jennifer.t@example.com',
                    score: 72,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-22T10:30:00',
                    timeSpent: 29,
                    totalQuestions: 20,
                    correctAnswers: 14
                },
                {
                    id: '9',
                    studentId: 'STU009',
                    studentName: 'Christopher Anderson',
                    email: 'chris.a@example.com',
                    score: 68,
                    passingScore: 70,
                    status: 'fail',
                    submittedAt: '2025-03-22T11:15:00',
                    timeSpent: 30,
                    totalQuestions: 20,
                    correctAnswers: 13
                },
                {
                    id: '10',
                    studentId: 'STU010',
                    studentName: 'Amanda Thomas',
                    email: 'amanda.t@example.com',
                    score: 82,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-23T09:00:00',
                    timeSpent: 27,
                    totalQuestions: 20,
                    correctAnswers: 16
                },
                {
                    id: '11',
                    studentId: 'STU011',
                    studentName: 'Daniel Jackson',
                    email: 'daniel.j@example.com',
                    score: 55,
                    passingScore: 70,
                    status: 'fail',
                    submittedAt: '2025-03-23T09:45:00',
                    timeSpent: 30,
                    totalQuestions: 20,
                    correctAnswers: 11
                },
                {
                    id: '12',
                    studentId: 'STU012',
                    studentName: 'Melissa White',
                    email: 'melissa.w@example.com',
                    score: 90,
                    passingScore: 70,
                    status: 'pass',
                    submittedAt: '2025-03-23T10:30:00',
                    timeSpent: 25,
                    totalQuestions: 20,
                    correctAnswers: 18
                }
            ];
            
            const mockStats = {
                averageScore: 77.5,
                passRate: 75,
                totalSubmissions: 12,
                highestScore: 95,
                lowestScore: 55,
                medianScore: 80,
                scoreDistribution: [
                    { min: 0, max: 20, count: 0 },
                    { min: 21, max: 40, count: 0 },
                    { min: 41, max: 60, count: 2 },
                    { min: 61, max: 80, count: 5 },
                    { min: 81, max: 100, count: 5 }
                ]
            };
            
            setResults(mockResults);
            setStats(mockStats);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch results');
            setLoading(false);
        }
    };

    const handleAssessmentChange = (e) => {
        setSelectedAssessment(e.target.value);
        // Update URL without reloading the page
        if (e.target.value) {
            navigate(`/admin/assessments/results?assessmentId=${e.target.value}`, { replace: true });
        } else {
            navigate('/admin/assessments/results', { replace: true });
        }
    };

    const handleExport = async () => {
        try {
            // In production, use the actual API call
            // const response = await axios.get(
            //     `${process.env.REACT_APP_API_URL}/api/admin/assessments/${selectedAssessment}/results/export`,
            //     { responseType: 'blob' }
            // );
            
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', `assessment-results-${selectedAssessment}.csv`);
            // document.body.appendChild(link);
            // link.click();
            // link.remove();
            
            // For development, just show an alert
            alert('Export functionality will be available in production');
        } catch (err) {
            setError('Failed to export results');
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    // Filter results based on search term
    const filteredResults = results.filter(result => 
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort results
    const sortedResults = [...filteredResults].sort((a, b) => {
        let comparison = 0;
        if (a[sortField] > b[sortField]) {
            comparison = 1;
        } else if (a[sortField] < b[sortField]) {
            comparison = -1;
        }
        return sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedResults.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Chart data
    const scoreDistributionData = {
        labels: stats.scoreDistribution.map(item => `${item.min}-${item.max}%`),
        datasets: [
            {
                label: 'Number of Students',
                data: stats.scoreDistribution.map(item => item.count),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }
        ]
    };

    const passFailData = {
        labels: ['Pass', 'Fail'],
        datasets: [
            {
                data: [
                    Math.round(stats.passRate * stats.totalSubmissions / 100),
                    stats.totalSubmissions - Math.round(stats.passRate * stats.totalSubmissions / 100)
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Score Distribution'
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Pass/Fail Rate'
            }
        }
    };

    if (loading && selectedAssessment) {
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button 
                        className="admin-btn admin-btn-outline me-3"
                        onClick={() => navigate('/admin/assessments')}
                    >
                        <FaArrowLeft className="me-2" /> Back
                    </button>
                    <h2 className="mb-0">Assessment Results</h2>
                </div>
                {selectedAssessment && (
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={handleExport}
                    >
                        <FaDownload className="me-2" /> Export Results
                    </button>
                )}
            </div>

            <div className="admin-card mb-4">
                <div className="admin-card-header">
                    <h5 className="admin-card-title">Select Assessment</h5>
                </div>
                <div className="admin-card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Assessment</label>
                                <select
                                    className="admin-form-select"
                                    value={selectedAssessment}
                                    onChange={handleAssessmentChange}
                                >
                                    <option value="">Select an assessment</option>
                                    {assessments.map(assessment => (
                                        <option key={assessment.id} value={assessment.id}>
                                            {assessment.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="admin-form-group">
                                <label className="admin-form-label">Search</label>
                                <div className="position-relative">
                                    <FaSearch className="position-absolute" style={{ left: '15px', top: '12px', color: '#64748b' }} />
                                    <input
                                        type="text"
                                        className="admin-form-control ps-4"
                                        placeholder="Search by student name, email, or ID"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        disabled={!selectedAssessment}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedAssessment ? (
                <>
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="admin-stat-card">
                                <div className="admin-stat-card-icon bg-primary">
                                    <FaUserGraduate />
                                </div>
                                <div className="admin-stat-card-content">
                                    <h3>{stats.totalSubmissions}</h3>
                                    <p>Total Submissions</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="admin-stat-card">
                                <div className="admin-stat-card-icon bg-success">
                                    <FaPercentage />
                                </div>
                                <div className="admin-stat-card-content">
                                    <h3>{stats.averageScore.toFixed(1)}%</h3>
                                    <p>Average Score</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="admin-stat-card">
                                <div className="admin-stat-card-icon bg-info">
                                    <FaTrophy />
                                </div>
                                <div className="admin-stat-card-content">
                                    <h3>{stats.passRate}%</h3>
                                    <p>Pass Rate</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="admin-stat-card">
                                <div className="admin-stat-card-icon bg-warning">
                                    <FaChartBar />
                                </div>
                                <div className="admin-stat-card-content">
                                    <h3>{stats.highestScore}%</h3>
                                    <p>Highest Score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-8">
                            <div className="admin-card h-100">
                                <div className="admin-card-header">
                                    <h5 className="admin-card-title">Score Distribution</h5>
                                </div>
                                <div className="admin-card-body">
                                    <Bar data={scoreDistributionData} options={barOptions} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="admin-card h-100">
                                <div className="admin-card-header">
                                    <h5 className="admin-card-title">Pass/Fail Rate</h5>
                                </div>
                                <div className="admin-card-body d-flex justify-content-center">
                                    <div style={{ width: '80%' }}>
                                        <Pie data={passFailData} options={pieOptions} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-header d-flex justify-content-between align-items-center">
                            <h5 className="admin-card-title mb-0">Student Results</h5>
                            <div>
                                <span className="text-muted">
                                    Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedResults.length)} of {sortedResults.length} results
                                </span>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('studentName')}>
                                            Student {getSortIcon('studentName')}
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('score')}>
                                            Score {getSortIcon('score')}
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                                            Status {getSortIcon('status')}
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('correctAnswers')}>
                                            Correct Answers {getSortIcon('correctAnswers')}
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('timeSpent')}>
                                            Time Spent {getSortIcon('timeSpent')}
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('submittedAt')}>
                                            Submitted At {getSortIcon('submittedAt')}
                                        </th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map(result => (
                                            <tr key={result.id}>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-medium">{result.studentName}</span>
                                                        <span className="small text-muted">{result.email}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-2" style={{ width: '40px', height: '40px' }}>
                                                            <div 
                                                                className="admin-progress-circle" 
                                                                style={{ 
                                                                    '--progress': `${result.score}%`,
                                                                    '--color': result.status === 'pass' ? '#10b981' : '#ef4444'
                                                                }}
                                                            >
                                                                <span>{result.score}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`admin-badge ${result.status === 'pass' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                                                        {result.status === 'pass' ? 'Pass' : 'Fail'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="fw-medium">{result.correctAnswers}</span>
                                                    <span className="text-muted"> / {result.totalQuestions}</span>
                                                </td>
                                                <td>{result.timeSpent} mins</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <FaCalendarAlt className="text-muted me-2" size={14} />
                                                        <span>{formatDate(result.submittedAt)}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <button 
                                                        className="admin-btn admin-btn-sm admin-btn-info admin-btn-icon"
                                                        onClick={() => navigate(`/admin/assessments/results/${result.id}`)}
                                                        title="View Details"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                No results found matching your criteria
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
                </>
            ) : (
                <div className="admin-card">
                    <div className="admin-card-body text-center py-5">
                        <div className="mb-3">
                            <FaChartBar size={48} className="text-muted" />
                        </div>
                        <h4>No Assessment Selected</h4>
                        <p className="text-muted">Please select an assessment to view results</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentResults;
