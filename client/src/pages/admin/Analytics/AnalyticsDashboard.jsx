import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
<<<<<<< Updated upstream
=======
import '../../../utils/chartConfig';

>>>>>>> Stashed changes
import { FaGraduationCap, FaBook, FaUsers, FaChartLine, FaMoneyBillWave, FaUserGraduate, FaChartBar } from 'react-icons/fa';
import EnrollmentAnalytics from './components/EnrollmentAnalytics';
import RevenueAnalytics from './components/RevenueAnalytics';
import StudentPerformanceAnalytics from './components/StudentPerformanceAnalytics';

// Chart.js registration is now handled in chartConfig.js

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [analytics, setAnalytics] = useState({
        totalStudents: 0,
        totalCourses: 0,
        totalRevenue: 0,
        activeUsers: 0,
        courseEnrollments: [],
        studentProgress: [],
        courseCompletion: [],
        revenueData: [],
        popularCourses: [],
        studentEngagement: []
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            // In a real app:
            // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/analytics`);
            // setAnalytics(response.data);
            
            // Using mock data for development
            setAnalytics({
                totalStudents: 1250,
                totalCourses: 45,
                totalRevenue: 125750.45,
                activeUsers: 850,
                courseEnrollments: [
                    { month: 'Jan', count: 120 },
                    { month: 'Feb', count: 150 },
                    { month: 'Mar', count: 200 },
                    { month: 'Apr', count: 180 },
                    { month: 'May', count: 220 },
                    { month: 'Jun', count: 250 }
                ],
                studentProgress: [
                    { course: 'Web Development', averageProgress: 75 },
                    { course: 'Data Science', averageProgress: 68 },
                    { course: 'Mobile Development', averageProgress: 82 },
                    { course: 'UI/UX Design', averageProgress: 90 },
                    { course: 'Cloud Computing', averageProgress: 65 }
                ],
                courseCompletion: {
                    completed: 450,
                    inProgress: 650,
                    notStarted: 150
                },
                revenueData: [
                    { month: 'Jan', amount: 18500.25 },
                    { month: 'Feb', amount: 15750.50 },
                    { month: 'Mar', amount: 21300.75 },
                    { month: 'Apr', amount: 19800.30 },
                    { month: 'May', amount: 22450.80 },
                    { month: 'Jun', amount: 27950.85 }
                ],
                popularCourses: [
                    { name: 'Advanced React Development', enrollments: 180 },
                    { name: 'Data Science Fundamentals', enrollments: 165 },
                    { name: 'Mobile App Development', enrollments: 150 },
                    { name: 'UI/UX Design Masterclass', enrollments: 135 },
                    { name: 'Cloud Computing Essentials', enrollments: 120 }
                ],
                studentEngagement: [
                    { type: 'Video Lectures', hours: 2500 },
                    { type: 'Reading Materials', hours: 1800 },
                    { type: 'Practical Exercises', hours: 3200 },
                    { type: 'Discussions', hours: 950 },
                    { type: 'Assessments', hours: 1550 }
                ]
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch analytics data');
            setLoading(false);
        }
    };

    const enrollmentChartData = {
        labels: analytics.courseEnrollments.map(item => item.month),
        datasets: [{
            label: 'Course Enrollments',
            data: analytics.courseEnrollments.map(item => item.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const progressChartData = {
        labels: analytics.studentProgress.map(item => item.course),
        datasets: [{
            label: 'Average Progress (%)',
            data: analytics.studentProgress.map(item => item.averageProgress),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
        }]
    };

    const completionChartData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
            data: [
                analytics.courseCompletion.completed,
                analytics.courseCompletion.inProgress,
                analytics.courseCompletion.notStarted
            ],
            backgroundColor: [
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(255, 99, 132, 0.5)'
            ],
            borderWidth: 1
        }]
    };

    const revenueChartData = {
        labels: analytics.revenueData.map(item => item.month),
        datasets: [{
            label: 'Revenue ($)',
            data: analytics.revenueData.map(item => item.amount),
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
        }]
    };

    const popularCoursesChartData = {
        labels: analytics.popularCourses.map(item => item.name),
        datasets: [{
            label: 'Enrollments',
            data: analytics.popularCourses.map(item => item.enrollments),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
        }]
    };

    const engagementChartData = {
        labels: analytics.studentEngagement.map(item => item.type),
        datasets: [{
            label: 'Hours Spent',
            data: analytics.studentEngagement.map(item => item.hours),
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ],
            borderWidth: 1
        }]
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
        <Container fluid className="p-4">
            <h2 className="mb-4">Analytics Dashboard</h2>
            
            <Tab.Container id="analytics-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row className="mb-4">
                    <Col>
                        <Nav variant="tabs" className="analytics-nav">
                            <Nav.Item>
                                <Nav.Link eventKey="overview">
                                    <FaChartBar className="me-2" />
                                    Overview
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="enrollment">
                                    <FaUsers className="me-2" />
                                    Enrollment
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="revenue">
                                    <FaMoneyBillWave className="me-2" />
                                    Revenue
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="performance">
                                    <FaUserGraduate className="me-2" />
                                    Student Performance
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                
                <Tab.Content>
                    <Tab.Pane eventKey="overview">
                        {/* Overview Tab */}
                        <Row className="mb-4">
                            <Col md={3}>
                                <Card className="text-center h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <FaUsers className="display-4 text-primary mb-3" />
                                        <h5>Total Students</h5>
                                        <h2>{analytics.totalStudents}</h2>
                                        <p className="text-muted">+15% from last month</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="text-center h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <FaBook className="display-4 text-success mb-3" />
                                        <h5>Total Courses</h5>
                                        <h2>{analytics.totalCourses}</h2>
                                        <p className="text-muted">+5 new this month</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="text-center h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <FaChartLine className="display-4 text-danger mb-3" />
                                        <h5>Total Revenue</h5>
                                        <h2>${analytics.totalRevenue.toLocaleString()}</h2>
                                        <p className="text-muted">+12% from last month</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="text-center h-100 border-0 shadow-sm">
                                    <Card.Body>
                                        <FaGraduationCap className="display-4 text-info mb-3" />
                                        <h5>Active Users</h5>
                                        <h2>{analytics.activeUsers}</h2>
                                        <p className="text-muted">68% of total students</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mb-4">
                            <Col md={6}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Header className="bg-transparent">
                                        <h5 className="mb-0">Course Enrollments</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Line data={enrollmentChartData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Header className="bg-transparent">
                                        <h5 className="mb-0">Revenue Trend</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Line data={revenueChartData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Header className="bg-transparent">
                                        <h5 className="mb-0">Course Completion Status</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Doughnut data={completionChartData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Header className="bg-transparent">
                                        <h5 className="mb-0">Popular Courses</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Bar data={popularCoursesChartData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4}>
                                <Card className="h-100 border-0 shadow-sm">
                                    <Card.Header className="bg-transparent">
                                        <h5 className="mb-0">Student Progress by Course</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Bar data={progressChartData} />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="enrollment">
                        <EnrollmentAnalytics />
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="revenue">
                        <RevenueAnalytics />
                    </Tab.Pane>
                    
                    <Tab.Pane eventKey="performance">
                        <StudentPerformanceAnalytics />
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default AnalyticsDashboard;
