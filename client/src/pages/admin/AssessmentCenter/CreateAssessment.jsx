import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FaSave, FaTimes, FaPlus, FaTrash, FaArrowLeft, FaQuestion, FaCode, FaFileAlt } from 'react-icons/fa';
import axios from 'axios';
import '../../../styles/adminTheme.css';

const CreateAssessment = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'quiz',
        courseId: '',
        duration: 30,
        passingScore: 70,
        totalPoints: 100,
        instructions: '',
        status: 'draft',
        questions: []
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            // In production, use the actual API call
            // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/courses`);
            // setCourses(response.data);
            
            // Mock data for development
            setCourses([
                { id: '1', title: 'JavaScript Basics' },
                { id: '2', title: 'React Fundamentals' },
                { id: '3', title: 'Database Systems' },
                { id: '4', title: 'Python Programming' },
                { id: '5', title: 'Full Stack Development' },
                { id: '6', title: 'Backend Development' },
                { id: '7', title: 'Frontend Design' },
                { id: '8', title: 'Mobile Development' }
            ]);
        } catch (err) {
            setError('Failed to fetch courses');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            text: '',
            type: 'multiple_choice',
            points: 10,
            options: [
                { id: Date.now() + 1, text: '', isCorrect: false },
                { id: Date.now() + 2, text: '', isCorrect: false }
            ],
            correctAnswer: formData.type === 'coding' ? '' : null
        };

        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const removeQuestion = (questionId) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
        }));
    };

    const handleQuestionChange = (questionId, field, value) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    return { ...q, [field]: value };
                }
                return q;
            })
        }));
    };

    const addOption = (questionId) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: [
                            ...q.options,
                            { id: Date.now(), text: '', isCorrect: false }
                        ]
                    };
                }
                return q;
            })
        }));
    };

    const removeOption = (questionId, optionId) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: q.options.filter(opt => opt.id !== optionId)
                    };
                }
                return q;
            })
        }));
    };

    const handleOptionChange = (questionId, optionId, field, value) => {
        setFormData(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: q.options.map(opt => {
                            if (opt.id === optionId) {
                                if (field === 'isCorrect' && value === true) {
                                    // If this option is being marked as correct, unmark all others
                                    return { ...opt, [field]: value };
                                } else {
                                    return { ...opt, [field]: value };
                                }
                            } else if (field === 'isCorrect' && value === true) {
                                // Unmark all other options
                                return { ...opt, isCorrect: false };
                            }
                            return opt;
                        })
                    };
                }
                return q;
            })
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Assessment title is required');
            return false;
        }
        
        if (!formData.courseId) {
            setError('Please select a course');
            return false;
        }
        
        if (formData.questions.length === 0) {
            setError('At least one question is required');
            return false;
        }
        
        for (const question of formData.questions) {
            if (!question.text.trim()) {
                setError('All questions must have text');
                return false;
            }
            
            if (question.type === 'multiple_choice') {
                if (question.options.length < 2) {
                    setError('Multiple choice questions must have at least 2 options');
                    return false;
                }
                
                const hasCorrectOption = question.options.some(opt => opt.isCorrect);
                if (!hasCorrectOption) {
                    setError('Each multiple choice question must have at least one correct answer');
                    return false;
                }
                
                for (const option of question.options) {
                    if (!option.text.trim()) {
                        setError('All options must have text');
                        return false;
                    }
                }
            } else if (question.type === 'coding' && !question.correctAnswer) {
                setError('Coding questions must have a correct answer or test case');
                return false;
            }
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            // In production, use the actual API call
            // await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/assessments`, formData);
            
            // For development, just simulate success
            setTimeout(() => {
                setSuccess(true);
                setLoading(false);
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/admin/assessments');
                }, 2000);
            }, 1000);
        } catch (err) {
            setError('Failed to create assessment');
            setLoading(false);
        }
    };

    const getQuestionTypeIcon = (type) => {
        switch(type) {
            case 'multiple_choice': return <FaQuestion />;
            case 'coding': return <FaCode />;
            case 'essay': return <FaFileAlt />;
            default: return <FaQuestion />;
        }
    };

    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Create Assessment</h2>
                <button 
                    className="admin-btn admin-btn-outline"
                    onClick={() => navigate('/admin/assessments')}
                >
                    <FaArrowLeft className="me-2" /> Back to Assessments
                </button>
            </div>

            {success && (
                <div className="admin-alert admin-alert-success mb-4">
                    <div className="admin-alert-icon">✓</div>
                    <div className="admin-alert-content">
                        <h4>Success!</h4>
                        <p>Assessment created successfully. Redirecting...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="admin-alert admin-alert-danger mb-4">
                    <div className="admin-alert-icon">!</div>
                    <div className="admin-alert-content">
                        <h4>Error</h4>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="admin-card mb-4">
                    <div className="admin-card-header">
                        <h5 className="admin-card-title">Assessment Information</h5>
                    </div>
                    <div className="admin-card-body">
                        <Row>
                            <Col md={6}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Title</label>
                                    <input
                                        type="text"
                                        className="admin-form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter assessment title"
                                        required
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Course</label>
                                    <select
                                        className="admin-form-select"
                                        name="courseId"
                                        value={formData.courseId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={4}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Assessment Type</label>
                                    <select
                                        className="admin-form-select"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                    >
                                        <option value="quiz">Quiz</option>
                                        <option value="coding">Coding Assignment</option>
                                        <option value="project">Project</option>
                                        <option value="exam">Final Exam</option>
                                    </select>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        className="admin-form-control"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        className="admin-form-control"
                                        name="passingScore"
                                        value={formData.passingScore}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={12}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Description</label>
                                    <textarea
                                        className="admin-form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Enter assessment description"
                                    ></textarea>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={12}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Instructions</label>
                                    <textarea
                                        className="admin-form-control"
                                        name="instructions"
                                        value={formData.instructions}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Enter instructions for students"
                                    ></textarea>
                                </div>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Total Points</label>
                                    <input
                                        type="number"
                                        className="admin-form-control"
                                        name="totalPoints"
                                        value={formData.totalPoints}
                                        onChange={handleChange}
                                        min="1"
                                    />
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="admin-form-group">
                                    <label className="admin-form-label">Status</label>
                                    <select
                                        className="admin-form-select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="scheduled">Scheduled</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                <div className="admin-card mb-4">
                    <div className="admin-card-header d-flex justify-content-between align-items-center">
                        <h5 className="admin-card-title mb-0">Questions</h5>
                        <button 
                            type="button" 
                            className="admin-btn admin-btn-primary admin-btn-sm"
                            onClick={addQuestion}
                        >
                            <FaPlus className="me-2" /> Add Question
                        </button>
                    </div>
                    <div className="admin-card-body">
                        {formData.questions.length === 0 ? (
                            <div className="text-center py-5">
                                <div className="mb-3">
                                    <FaQuestion size={40} className="text-muted" />
                                </div>
                                <h5 className="text-muted">No Questions Added</h5>
                                <p className="text-muted">Click the "Add Question" button to start creating your assessment.</p>
                                <button 
                                    type="button" 
                                    className="admin-btn admin-btn-primary"
                                    onClick={addQuestion}
                                >
                                    <FaPlus className="me-2" /> Add Question
                                </button>
                            </div>
                        ) : (
                            formData.questions.map((question, index) => (
                                <div key={question.id} className="admin-card mb-4">
                                    <div className="admin-card-header bg-light d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <span className="admin-badge admin-badge-primary me-2">Q{index + 1}</span>
                                            <h6 className="mb-0">{question.text || 'New Question'}</h6>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="admin-btn admin-btn-danger admin-btn-sm"
                                                onClick={() => removeQuestion(question.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="admin-card-body">
                                        <Row>
                                            <Col md={8}>
                                                <div className="admin-form-group">
                                                    <label className="admin-form-label">Question Text</label>
                                                    <textarea
                                                        className="admin-form-control"
                                                        value={question.text}
                                                        onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                                                        rows="2"
                                                        placeholder="Enter question text"
                                                    ></textarea>
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="admin-form-group">
                                                    <label className="admin-form-label">Type</label>
                                                    <select
                                                        className="admin-form-select"
                                                        value={question.type}
                                                        onChange={(e) => handleQuestionChange(question.id, 'type', e.target.value)}
                                                    >
                                                        <option value="multiple_choice">Multiple Choice</option>
                                                        <option value="coding">Coding</option>
                                                        <option value="essay">Essay</option>
                                                    </select>
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="admin-form-group">
                                                    <label className="admin-form-label">Points</label>
                                                    <input
                                                        type="number"
                                                        className="admin-form-control"
                                                        value={question.points}
                                                        onChange={(e) => handleQuestionChange(question.id, 'points', parseInt(e.target.value))}
                                                        min="1"
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        {question.type === 'multiple_choice' && (
                                            <div className="mt-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <label className="admin-form-label">Options</label>
                                                    <button
                                                        type="button"
                                                        className="admin-btn admin-btn-outline admin-btn-sm"
                                                        onClick={() => addOption(question.id)}
                                                    >
                                                        <FaPlus className="me-1" /> Add Option
                                                    </button>
                                                </div>
                                                
                                                {question.options.map((option, optIndex) => (
                                                    <div key={option.id} className="d-flex align-items-center mb-2">
                                                        <div className="admin-form-check me-2">
                                                            <input
                                                                type="radio"
                                                                className="admin-form-check-input"
                                                                checked={option.isCorrect}
                                                                onChange={() => handleOptionChange(question.id, option.id, 'isCorrect', true)}
                                                                id={`option-${question.id}-${option.id}`}
                                                            />
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <input
                                                                type="text"
                                                                className="admin-form-control"
                                                                value={option.text}
                                                                onChange={(e) => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                                                placeholder={`Option ${optIndex + 1}`}
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="admin-btn admin-btn-outline-danger admin-btn-sm ms-2"
                                                            onClick={() => removeOption(question.id, option.id)}
                                                            disabled={question.options.length <= 2}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {question.type === 'coding' && (
                                            <div className="mt-3">
                                                <div className="admin-form-group">
                                                    <label className="admin-form-label">Test Cases / Expected Output</label>
                                                    <textarea
                                                        className="admin-form-control"
                                                        value={question.correctAnswer || ''}
                                                        onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                                                        rows="4"
                                                        placeholder="Enter test cases or expected output"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        )}

                                        {question.type === 'essay' && (
                                            <div className="mt-3">
                                                <div className="admin-form-group">
                                                    <label className="admin-form-label">Grading Rubric</label>
                                                    <textarea
                                                        className="admin-form-control"
                                                        value={question.correctAnswer || ''}
                                                        onChange={(e) => handleQuestionChange(question.id, 'correctAnswer', e.target.value)}
                                                        rows="4"
                                                        placeholder="Enter grading rubric or guidelines"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="d-flex justify-content-between mb-5">
                    <button 
                        type="button" 
                        className="admin-btn admin-btn-outline"
                        onClick={() => navigate('/admin/assessments')}
                    >
                        <FaTimes className="me-2" /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="admin-btn admin-btn-primary"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <FaSave className="me-2" /> Save Assessment
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssessment;
