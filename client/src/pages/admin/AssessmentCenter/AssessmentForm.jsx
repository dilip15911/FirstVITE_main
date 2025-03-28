import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaGripVertical, FaPlus, FaTrash } from 'react-icons/fa';

const AssessmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [assessment, setAssessment] = useState({
        title: '',
        type: 'quiz',
        courseId: '',
        duration: 60,
        totalPoints: 0,
        passingScore: 70,
        instructions: '',
        status: 'draft',
        questions: []
    });

    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
        if (isEditMode) {
            fetchAssessment();
        }
    }, [id]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/courses`);
            setCourses(response.data);
        } catch (err) {
            setError('Failed to fetch courses');
        }
    };

    const fetchAssessment = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/assessments/${id}`);
            setAssessment(response.data);
        } catch (err) {
            setError('Failed to fetch assessment details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssessment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addQuestion = () => {
        setAssessment(prev => ({
            ...prev,
            questions: [...prev.questions, {
                id: Date.now(),
                type: 'multiple_choice',
                question: '',
                points: 1,
                options: ['', '', '', ''],
                correctAnswer: 0,
                explanation: ''
            }]
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...assessment.questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value
        };
        setAssessment(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...assessment.questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setAssessment(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const removeQuestion = (index) => {
        const updatedQuestions = assessment.questions.filter((_, i) => i !== index);
        setAssessment(prev => ({
            ...prev,
            questions: updatedQuestions
        }));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const questions = Array.from(assessment.questions);
        const [reorderedItem] = questions.splice(result.source.index, 1);
        questions.splice(result.destination.index, 0, reorderedItem);

        setAssessment(prev => ({
            ...prev,
            questions: questions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isEditMode) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/assessments/${id}`, assessment);
                setSuccess('Assessment updated successfully');
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/assessments`, assessment);
                setSuccess('Assessment created successfully');
            }

            setTimeout(() => {
                navigate('/admin/assessments');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save assessment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <h2 className="mb-4">{isEditMode ? 'Edit Assessment' : 'Create New Assessment'}</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Card className="mb-4">
                    <Card.Header>Basic Information</Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assessment Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={assessment.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Select
                                        name="type"
                                        value={assessment.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="quiz">Quiz</option>
                                        <option value="coding">Coding Assignment</option>
                                        <option value="project">Project</option>
                                        <option value="exam">Final Exam</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Course</Form.Label>
                                    <Form.Select
                                        name="courseId"
                                        value={assessment.courseId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Course</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duration (minutes)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="duration"
                                        value={assessment.duration}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Passing Score (%)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="passingScore"
                                        value={assessment.passingScore}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={assessment.status}
                                        onChange={handleChange}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Instructions</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="instructions"
                                value={assessment.instructions}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Card.Body>
                </Card>

                <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <span>Questions</span>
                        <Button variant="primary" onClick={addQuestion}>
                            <FaPlus className="me-1" /> Add Question
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="questions">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {assessment.questions.map((question, index) => (
                                            <Draggable
                                                key={question.id}
                                                draggableId={question.id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <Card
                                                        className="mb-3"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                    >
                                                        <Card.Header className="d-flex justify-content-between align-items-center">
                                                            <div {...provided.dragHandleProps}>
                                                                <FaGripVertical className="me-2" />
                                                                Question {index + 1}
                                                            </div>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => removeQuestion(index)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Row>
                                                                <Col md={8}>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label>Question</Form.Label>
                                                                        <Form.Control
                                                                            as="textarea"
                                                                            value={question.question}
                                                                            onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                                                                            required
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                                <Col md={4}>
                                                                    <Form.Group className="mb-3">
                                                                        <Form.Label>Points</Form.Label>
                                                                        <Form.Control
                                                                            type="number"
                                                                            value={question.points}
                                                                            onChange={(e) => handleQuestionChange(index, 'points', e.target.value)}
                                                                            required
                                                                        />
                                                                    </Form.Group>
                                                                </Col>
                                                            </Row>

                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Question Type</Form.Label>
                                                                <Form.Select
                                                                    value={question.type}
                                                                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                                                >
                                                                    <option value="multiple_choice">Multiple Choice</option>
                                                                    <option value="coding">Coding</option>
                                                                    <option value="text">Text Answer</option>
                                                                </Form.Select>
                                                            </Form.Group>

                                                            {question.type === 'multiple_choice' && (
                                                                <>
                                                                    {question.options.map((option, optionIndex) => (
                                                                        <Form.Group key={optionIndex} className="mb-2">
                                                                            <div className="d-flex align-items-center">
                                                                                <Form.Check
                                                                                    type="radio"
                                                                                    name={`correct_${question.id}`}
                                                                                    checked={question.correctAnswer === optionIndex}
                                                                                    onChange={() => handleQuestionChange(index, 'correctAnswer', optionIndex)}
                                                                                    className="me-2"
                                                                                />
                                                                                <Form.Control
                                                                                    value={option}
                                                                                    onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                                                                    placeholder={`Option ${optionIndex + 1}`}
                                                                                    required
                                                                                />
                                                                            </div>
                                                                        </Form.Group>
                                                                    ))}
                                                                </>
                                                            )}

                                                            {question.type === 'coding' && (
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label>Test Cases</Form.Label>
                                                                    <Form.Control
                                                                        as="textarea"
                                                                        rows={3}
                                                                        value={question.testCases || ''}
                                                                        onChange={(e) => handleQuestionChange(index, 'testCases', e.target.value)}
                                                                        placeholder="Enter test cases in JSON format"
                                                                        required
                                                                    />
                                                                </Form.Group>
                                                            )}

                                                            <Form.Group className="mb-3">
                                                                <Form.Label>Explanation</Form.Label>
                                                                <Form.Control
                                                                    as="textarea"
                                                                    value={question.explanation}
                                                                    onChange={(e) => handleQuestionChange(index, 'explanation', e.target.value)}
                                                                    placeholder="Explain the correct answer"
                                                                />
                                                            </Form.Group>
                                                        </Card.Body>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Card.Body>
                </Card>

                <div className="d-flex justify-content-end gap-2 mb-4">
                    <Button variant="secondary" onClick={() => navigate('/admin/assessments')}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update Assessment' : 'Create Assessment')}
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default AssessmentForm;
