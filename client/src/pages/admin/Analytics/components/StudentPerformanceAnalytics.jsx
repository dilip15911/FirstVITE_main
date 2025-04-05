import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { Bar, Radar, Scatter } from 'react-chartjs-2';
import 'react-datepicker/dist/react-datepicker.css';

const StudentPerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState({
    courseCompletionRates: [],
    assessmentScores: [],
    timeSpent: [],
    skillsAcquired: [],
    correlationData: []
  });
  const [courseFilter, setCourseFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  // Mock data for development
  const mockPerformanceData = {
    courseCompletionRates: [
      { course: 'Web Development', completionRate: 78 },
      { course: 'Data Science', completionRate: 65 },
      { course: 'Mobile Development', completionRate: 82 },
      { course: 'UI/UX Design', completionRate: 88 },
      { course: 'Cloud Computing', completionRate: 72 }
    ],
    assessmentScores: [
      { assessment: 'Quizzes', averageScore: 82 },
      { assessment: 'Assignments', averageScore: 76 },
      { assessment: 'Projects', averageScore: 85 },
      { assessment: 'Final Exams', averageScore: 79 },
      { assessment: 'Peer Reviews', averageScore: 88 }
    ],
    timeSpent: [
      { category: 'Video Lectures', averageHours: 25 },
      { category: 'Reading Materials', averageHours: 15 },
      { category: 'Practical Exercises', averageHours: 30 },
      { category: 'Discussions', averageHours: 8 },
      { category: 'Assessments', averageHours: 12 }
    ],
    skillsAcquired: [
      { skill: 'Technical Knowledge', score: 4.2 },
      { skill: 'Problem Solving', score: 3.8 },
      { skill: 'Communication', score: 3.5 },
      { skill: 'Teamwork', score: 3.7 },
      { skill: 'Time Management', score: 3.9 },
      { skill: 'Critical Thinking', score: 4.0 }
    ],
    correlationData: [
      { timeSpent: 10, score: 65 },
      { timeSpent: 15, score: 68 },
      { timeSpent: 20, score: 72 },
      { timeSpent: 25, score: 78 },
      { timeSpent: 30, score: 82 },
      { timeSpent: 35, score: 85 },
      { timeSpent: 40, score: 88 },
      { timeSpent: 45, score: 90 },
      { timeSpent: 50, score: 92 },
      { timeSpent: 55, score: 93 },
      { timeSpent: 60, score: 95 }
    ]
  };

  const mockCourses = [
    { id: 1, name: 'All Courses' },
    { id: 2, name: 'Web Development' },
    { id: 3, name: 'Data Science' },
    { id: 4, name: 'Mobile Development' },
    { id: 5, name: 'UI/UX Design' },
    { id: 6, name: 'Cloud Computing' }
  ];

  useEffect(() => {
    fetchCourses();
    fetchPerformanceData();
  }, [courseFilter, fetchCourses, fetchPerformanceData]);

  const fetchCourses = async () => {
    try {
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/courses`);
      // setCourses(response.data);

      // Using mock data for development
      setCourses(mockCourses);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(
      //   `${process.env.REACT_APP_API_URL}/api/admin/analytics/student-performance?course=${courseFilter}`
      // );
      // setPerformanceData(response.data);

      // Using mock data for development
      setPerformanceData(mockPerformanceData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch student performance data');
      setLoading(false);
    }
  };

  const getCompletionRatesChartData = () => {
    return {
      labels: performanceData.courseCompletionRates.map(item => item.course),
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: performanceData.courseCompletionRates.map(item => item.completionRate),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getAssessmentScoresChartData = () => {
    return {
      labels: performanceData.assessmentScores.map(item => item.assessment),
      datasets: [
        {
          label: 'Average Score (%)',
          data: performanceData.assessmentScores.map(item => item.averageScore),
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getSkillsRadarChartData = () => {
    return {
      labels: performanceData.skillsAcquired.map(item => item.skill),
      datasets: [
        {
          label: 'Average Skill Rating (out of 5)',
          data: performanceData.skillsAcquired.map(item => item.score),
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const getCorrelationChartData = () => {
    return {
      datasets: [
        {
          label: 'Time Spent vs. Score',
          data: performanceData.correlationData.map(item => ({
            x: item.timeSpent,
            y: item.score
          })),
          backgroundColor: 'rgba(54, 162, 235, 0.5)'
        }
      ]
    };
  };

  const completionRatesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Course Completion Rates'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Completion Rate (%)'
        }
      }
    }
  };

  const assessmentScoresOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Assessment Scores'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Score (%)'
        }
      }
    }
  };

  const skillsRadarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Skills Acquired'
      }
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const correlationOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Correlation: Time Spent vs. Assessment Score'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Average Time Spent (hours)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Score (%)'
        }
      }
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
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Student Performance Analytics</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Filter by Course</Form.Label>
              <Form.Select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">All Courses</option>
                {courses.filter(course => course.name !== 'All Courses').map((course) => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button 
              variant="primary" 
              onClick={fetchPerformanceData}
              className="w-100"
            >
              Apply Filter
            </Button>
          </Col>
        </Row>

        {/* Performance Overview */}
        <Row className="mb-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Course Completion Rates</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }}>
                  <Bar data={getCompletionRatesChartData()} options={completionRatesOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Assessment Performance</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }}>
                  <Bar data={getAssessmentScoresChartData()} options={assessmentScoresOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Skills Acquired</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Radar data={getSkillsRadarChartData()} options={skillsRadarOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Time Spent vs. Performance</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '300px' }}>
                  <Scatter data={getCorrelationChartData()} options={correlationOptions} />
                </div>
                <div className="mt-3">
                  <p className="text-muted small">
                    <strong>Insight:</strong> There is a positive correlation between time spent on course materials and assessment scores. 
                    Students who spend more than 30 hours on average tend to score above 80%.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Time Allocation by Learning Activity</h6>
              </Card.Header>
              <Card.Body>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Learning Activity</th>
                      <th>Average Time Spent (hours)</th>
                      <th>Percentage of Total Time</th>
                      <th>Impact on Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.timeSpent.map((item, index) => {
                      const totalHours = performanceData.timeSpent.reduce((sum, i) => sum + i.averageHours, 0);
                      const percentage = (item.averageHours / totalHours * 100).toFixed(1);
                      
                      let impact;
                      if (item.category === 'Practical Exercises' || item.category === 'Video Lectures') {
                        impact = <Badge bg="success">High</Badge>;
                      } else if (item.category === 'Reading Materials' || item.category === 'Assessments') {
                        impact = <Badge bg="primary">Medium</Badge>;
                      } else {
                        impact = <Badge bg="secondary">Low</Badge>;
                      }
                      
                      return (
                        <tr key={index}>
                          <td>{item.category}</td>
                          <td>{item.averageHours}</td>
                          <td>{percentage}%</td>
                          <td>{impact}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StudentPerformanceAnalytics;
