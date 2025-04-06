import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaDownload, FaEye, FaCalendarAlt, FaClock, FaUserGraduate, FaBook, FaCheckCircle, FaPlus } from 'react-icons/fa';
import '../../../styles/adminTheme.css';

const AssessmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Mock data for development using useMemo to prevent unnecessary re-renders
    const mockAssessmentData = useMemo(() => ({
        id: id,
        title: 'Advanced JavaScript Concepts',
        description: 'This assessment tests understanding of advanced JavaScript concepts including closures, prototypes, and async programming.',
        type: 'quiz',
        status: 'active',
        courseName: 'JavaScript Masterclass',
        courseId: '123',
        duration: 60,
        totalQuestions: 25,
        passingScore: 70,
        dueDate: '2025-04-15',
        createdAt: '2025-03-20',
        updatedAt: '2025-03-25',
        questions: [
            { id: 1, text: 'What is a closure in JavaScript?', type: 'multiple_choice', points: 5, 
              options: ['A way to close the browser', 'A function with access to its outer scope', 'A method to end a loop', 'None of the above'],
              correctAnswer: 1 },
            { id: 2, text: 'Explain how prototypal inheritance works in JavaScript', type: 'essay', points: 10 },
            { id: 3, text: 'What is the output of the following code?\n\nconsole.log(typeof null);', type: 'multiple_choice', points: 5,
              options: ['null', 'undefined', 'object', 'string'],
              correctAnswer: 2 },
            { id: 4, text: 'Implement a function that returns a Promise which resolves after a given delay', type: 'coding', points: 15 },
            { id: 5, text: 'What is the difference between let, const, and var?', type: 'multiple_choice', points: 5,
              options: ['Scope differences only', 'Hoisting differences only', 'Both scope and hoisting differences', 'No difference'],
              correctAnswer: 2 }
        ],
        submissions: [
            { id: 101, studentName: 'John Doe', studentId: 'S1001', submittedAt: '2025-03-26', score: 85, status: 'passed' },
            { id: 102, studentName: 'Jane Smith', studentId: 'S1002', submittedAt: '2025-03-26', score: 92, status: 'passed' },
            { id: 103, studentName: 'Bob Johnson', studentId: 'S1003', submittedAt: '2025-03-27', score: 65, status: 'failed' },
            { id: 104, studentName: 'Alice Brown', studentId: 'S1004', submittedAt: '2025-03-27', score: 78, status: 'passed' }
        ]
    }), [id]);

    const fetchAssessment = useCallback(async () => {
        try {
            setLoading(true);
            // In a real app:
            // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/assessments/${id}`);
            // setAssessment(response.data);
            
            // Using mock data for development
            setAssessment(mockAssessmentData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch assessment details');
            setLoading(false);
        }
    }, [mockAssessmentData]);

    useEffect(() => {
        fetchAssessment();
    }, [fetchAssessment]);

    const handleExport = async () => {
        try {
            // Simulate export functionality
            alert('Assessment export initiated. The file will download shortly.');
            
            // In production, uncomment the actual API call
            /*
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/admin/assessments/${id}/export`,
                { responseType: 'blob' }
            );
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `assessment-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            */
        } catch (err) {
            setError('Failed to export assessment');
        }
    };

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
    
    if (!assessment) {
        return (
            <div className="admin-card">
                <div className="admin-card-body">
                    <div className="alert alert-warning" role="alert">
                        <h4 className="alert-heading">Not Found</h4>
                        <p>The requested assessment could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <button 
                        className="admin-btn admin-btn-outline admin-btn-icon me-3"
                        onClick={() => navigate('/admin/assessments')}
                    >
                        <FaArrowLeft />
                    </button>
                    <h2 className="mb-0">Assessment Details</h2>
                </div>
                <div>
                    <button 
                        className="admin-btn admin-btn-warning me-2"
                        onClick={() => navigate(`/admin/assessments/${id}/edit`)}
                    >
                        <FaEdit className="me-2" /> Edit
                    </button>
                    <button 
                        className="admin-btn admin-btn-primary"
                        onClick={handleExport}
                    >
                        <FaDownload className="me-2" /> Export
                    </button>
                </div>
            </div>

            <div className="admin-card mb-4">
                <div className="admin-card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="admin-card-title">{assessment.title}</h4>
                        <div className="d-flex">
                            <span className={`admin-badge admin-badge-${
                                assessment.type === 'quiz' ? 'info' :
                                assessment.type === 'coding' ? 'warning' :
                                assessment.type === 'project' ? 'success' : 'primary'
                            } me-2`}>
                                {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                            </span>
                            <span className={`admin-badge admin-badge-${assessment.status === 'active' ? 'success' : 'light'}`}>
                                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="admin-card-body">
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Overview
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('questions')}
                            >
                                Questions
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'submissions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('submissions')}
                            >
                                Submissions
                            </button>
                        </li>
                    </ul>
                    
                    {activeTab === 'overview' && (
                        <div className="slide-in-left">
                            <Row>
                                <Col md={6}>
                                    <div className="mb-4">
                                        <h5 className="mb-3">Assessment Information</h5>
                                        <div className="mb-3 d-flex align-items-center">
                                            <FaBook className="me-2 text-primary" />
                                            <div>
                                                <div className="text-muted small">Course</div>
                                                <div>{assessment.courseName}</div>
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center">
                                            <FaClock className="me-2 text-primary" />
                                            <div>
                                                <div className="text-muted small">Duration</div>
                                                <div>{assessment.duration} minutes</div>
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center">
                                            <FaCalendarAlt className="me-2 text-primary" />
                                            <div>
                                                <div className="text-muted small">Due Date</div>
                                                <div>{new Date(assessment.dueDate).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-4">
                                        <h5 className="mb-3">Scoring</h5>
                                        <div className="mb-3 d-flex align-items-center">
                                            <FaCheckCircle className="me-2 text-success" />
                                            <div>
                                                <div className="text-muted small">Passing Score</div>
                                                <div>{assessment.passingScore}%</div>
                                            </div>
                                        </div>
                                        <div className="mb-3 d-flex align-items-center">
                                            <FaUserGraduate className="me-2 text-primary" />
                                            <div>
                                                <div className="text-muted small">Total Questions</div>
                                                <div>{assessment.totalQuestions}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            
                            <div className="mb-4">
                                <h5 className="mb-3">Description</h5>
                                <p>{assessment.description}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h5 className="mb-3">Timeline</h5>
                                <div className="d-flex">
                                    <div className="me-4">
                                        <div className="text-muted small">Created</div>
                                        <div>{new Date(assessment.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted small">Last Updated</div>
                                        <div>{new Date(assessment.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'questions' && (
                        <div className="slide-in-left">
                            <div className="mb-3 d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">Question List</h5>
                                <button className="admin-btn admin-btn-sm admin-btn-primary">
                                    <FaPlus className="me-1" /> Add Question
                                </button>
                            </div>
                            
                            {assessment.questions.map((question, index) => (
                                <div key={question.id} className="admin-card mb-3">
                                    <div className="admin-card-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="badge bg-secondary me-2">Q{index + 1}</span>
                                            <span className={`admin-badge admin-badge-${
                                                question.type === 'multiple_choice' ? 'info' :
                                                question.type === 'essay' ? 'warning' :
                                                question.type === 'coding' ? 'primary' : 'light'
                                            } me-2`}>
                                                {question.type.replace('_', ' ')}
                                            </span>
                                            <span className="admin-badge admin-badge-light">{question.points} pts</span>
                                        </div>
                                        <div>
                                            <button className="admin-btn admin-btn-sm admin-btn-outline admin-btn-icon me-1">
                                                <FaEdit />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="admin-card-body">
                                        <p className="mb-3" style={{ whiteSpace: 'pre-line' }}>{question.text}</p>
                                        
                                        {question.type === 'multiple_choice' && question.options && (
                                            <div className="ms-3">
                                                {question.options.map((option, optIndex) => (
                                                    <div key={optIndex} className={`mb-2 d-flex align-items-center ${question.correctAnswer === optIndex ? 'text-success' : ''}`}>
                                                        <div className={`me-2 d-flex align-items-center justify-content-center rounded-circle ${question.correctAnswer === optIndex ? 'bg-success text-white' : 'bg-light'}`} style={{ width: '24px', height: '24px' }}>
                                                            {String.fromCharCode(65 + optIndex)}
                                                        </div>
                                                        <div>{option}</div>
                                                        {question.correctAnswer === optIndex && <FaCheckCircle className="ms-2 text-success" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {activeTab === 'submissions' && (
                        <div className="slide-in-left">
                            <div className="table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>ID</th>
                                            <th>Submitted</th>
                                            <th>Score</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assessment.submissions.map(submission => (
                                            <tr key={submission.id}>
                                                <td>{submission.studentName}</td>
                                                <td>{submission.studentId}</td>
                                                <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                                                <td>{submission.score}%</td>
                                                <td>
                                                    <span className={`admin-badge admin-badge-${submission.status === 'passed' ? 'success' : 'danger'}`}>
                                                        {submission.status === 'passed' ? 'Passed' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="admin-btn admin-btn-sm admin-btn-info admin-btn-icon me-1">
                                                        <FaEye />
                                                    </button>
                                                    <button className="admin-btn admin-btn-sm admin-btn-primary admin-btn-icon">
                                                        <FaDownload />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssessmentDetails;
