import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { FaCalendarAlt, FaUserCheck, FaUserTimes, FaFileExport, FaFilter, FaSearch, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Bar } from 'react-chartjs-2';
import '../../../utils/chartConfig';

const AttendanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [dateRange, setDateRange] = useState([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    total: 0
  });

  useEffect(() => {
    document.title = "Attendance Management | Admin Dashboard";
    fetchAttendanceData();
    fetchCourses();
  }, []);

  useEffect(() => {
    filterAttendanceData();
  }, [attendanceData, selectedCourse, dateRange, searchTerm]);

  // Mock data for development
  const fetchAttendanceData = () => {
    // In a real application, this would be an API call
    // For now, we'll use mock data
    setTimeout(() => {
      const mockData = generateMockAttendanceData();
      setAttendanceData(mockData);
      setFilteredData(mockData);
      setLoading(false);
    }, 1000);
  };

  const fetchCourses = () => {
    // In a real application, this would be an API call
    // For now, we'll use mock data
    setTimeout(() => {
      const mockCourses = [
        { id: 1, name: 'Introduction to Web Development' },
        { id: 2, name: 'Advanced JavaScript' },
        { id: 3, name: 'React Fundamentals' },
        { id: 4, name: 'Node.js Backend Development' },
        { id: 5, name: 'Database Design and SQL' }
      ];
      setCourses(mockCourses);
    }, 500);
  };

  const generateMockAttendanceData = () => {
    const statuses = ['present', 'absent', 'late', 'excused'];
    const students = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 3, name: 'Michael Johnson', email: 'michael.johnson@example.com' },
      { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
      { id: 5, name: 'Robert Wilson', email: 'robert.wilson@example.com' },
      { id: 6, name: 'Sarah Brown', email: 'sarah.brown@example.com' },
      { id: 7, name: 'David Miller', email: 'david.miller@example.com' },
      { id: 8, name: 'Jennifer Taylor', email: 'jennifer.taylor@example.com' },
      { id: 9, name: 'James Anderson', email: 'james.anderson@example.com' },
      { id: 10, name: 'Lisa Thomas', email: 'lisa.thomas@example.com' }
    ];

    const mockData = [];
    const today = new Date();
    
    // Generate attendance records for the past 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // For each course
      for (let courseId = 1; courseId <= 5; courseId++) {
        // For each student
        students.forEach(student => {
          // Randomize attendance status with a bias towards present
          const randomIndex = Math.floor(Math.random() * 10);
          const status = randomIndex < 7 ? 'present' : statuses[Math.floor(Math.random() * statuses.length)];
          
          mockData.push({
            id: `${date.toISOString()}-${courseId}-${student.id}`,
            date: date,
            courseId: courseId,
            courseName: ['Introduction to Web Development', 'Advanced JavaScript', 'React Fundamentals', 'Node.js Backend Development', 'Database Design and SQL'][courseId - 1],
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email,
            status: status,
            notes: status === 'excused' ? 'Medical appointment' : '',
            recordedBy: 'Admin User',
            recordedAt: new Date(date.getTime() - Math.floor(Math.random() * 3600000))
          });
        });
      }
    }
    
    return mockData;
  };

  const filterAttendanceData = () => {
    if (!attendanceData.length) return;
    
    let filtered = [...attendanceData];
    
    // Filter by course
    if (selectedCourse !== 'all') {
      filtered = filtered.filter(item => item.courseId === parseInt(selectedCourse));
    }
    
    // Filter by date range
    if (startDate && endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.studentName.toLowerCase().includes(term) || 
        item.studentEmail.toLowerCase().includes(term) ||
        item.courseName.toLowerCase().includes(term)
      );
    }
    
    setFilteredData(filtered);
    
    // Calculate stats
    const stats = {
      present: filtered.filter(item => item.status === 'present').length,
      absent: filtered.filter(item => item.status === 'absent').length,
      late: filtered.filter(item => item.status === 'late').length,
      excused: filtered.filter(item => item.status === 'excused').length,
      total: filtered.length
    };
    
    setAttendanceStats(stats);
  };

  const handleDateChange = (update) => {
    setDateRange(update);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'danger';
      case 'late':
        return 'warning';
      case 'excused':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getAttendanceChartData = () => {
    // Group by date and count statuses
    const dateMap = new Map();
    
    filteredData.forEach(item => {
      const dateStr = item.date.toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, { date: dateStr, present: 0, absent: 0, late: 0, excused: 0 });
      }
      
      const dateData = dateMap.get(dateStr);
      dateData[item.status]++;
    });
    
    // Convert map to array and sort by date
    const chartData = Array.from(dateMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Only show the last 10 days for readability
    const recentData = chartData.slice(-10);
    
    return {
      labels: recentData.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Present',
          data: recentData.map(item => item.present),
          backgroundColor: 'rgba(40, 167, 69, 0.6)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1
        },
        {
          label: 'Absent',
          data: recentData.map(item => item.absent),
          backgroundColor: 'rgba(220, 53, 69, 0.6)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1
        },
        {
          label: 'Late',
          data: recentData.map(item => item.late),
          backgroundColor: 'rgba(255, 193, 7, 0.6)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1
        },
        {
          label: 'Excused',
          data: recentData.map(item => item.excused),
          backgroundColor: 'rgba(23, 162, 184, 0.6)',
          borderColor: 'rgba(23, 162, 184, 1)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance Trends (Last 10 Days)'
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Attendance Management</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="overview" title={<><FaChartBar className="me-2" />Overview</>}>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaUserCheck className="display-4 text-success mb-3" />
                  <h5>Present</h5>
                  <h2>{attendanceStats.present}</h2>
                  <p className="text-muted mb-0">{attendanceStats.total ? Math.round((attendanceStats.present / attendanceStats.total) * 100) : 0}%</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaUserTimes className="display-4 text-danger mb-3" />
                  <h5>Absent</h5>
                  <h2>{attendanceStats.absent}</h2>
                  <p className="text-muted mb-0">{attendanceStats.total ? Math.round((attendanceStats.absent / attendanceStats.total) * 100) : 0}%</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaUserCheck className="display-4 text-warning mb-3" />
                  <h5>Late</h5>
                  <h2>{attendanceStats.late}</h2>
                  <p className="text-muted mb-0">{attendanceStats.total ? Math.round((attendanceStats.late / attendanceStats.total) * 100) : 0}%</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaCalendarAlt className="display-4 text-info mb-3" />
                  <h5>Excused</h5>
                  <h2>{attendanceStats.excused}</h2>
                  <p className="text-muted mb-0">{attendanceStats.total ? Math.round((attendanceStats.excused / attendanceStats.total) * 100) : 0}%</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Attendance Trends</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Bar data={getAttendanceChartData()} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="records" title={<><FaCalendarAlt className="me-2" />Attendance Records</>}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Filter Attendance Records</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Course</Form.Label>
                    <Form.Select value={selectedCourse} onChange={handleCourseChange}>
                      <option value="all">All Courses</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date Range</Form.Label>
                    <DatePicker
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={handleDateChange}
                      className="form-control"
                      dateFormat="MMMM d, yyyy"
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group className="mb-3">
                    <Form.Label>Search</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Search by student name, email or course"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button variant="outline-secondary" className="me-2">
                  <FaFilter className="me-2" />
                  Reset Filters
                </Button>
                <Button variant="outline-primary">
                  <FaFileExport className="me-2" />
                  Export Data
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header>
              <h5 className="mb-0">Attendance Records</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 20).map(record => (
                      <tr key={record.id}>
                        <td>{record.date.toLocaleDateString()}</td>
                        <td>
                          <div>{record.studentName}</div>
                          <small className="text-muted">{record.studentEmail}</small>
                        </td>
                        <td>{record.courseName}</td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(record.status)}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </td>
                        <td>{record.notes || '-'}</td>
                        <td>
                          <div>{record.recordedBy}</div>
                          <small className="text-muted">{record.recordedAt.toLocaleTimeString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {filteredData.length > 20 && (
                <div className="text-center mt-3">
                  <p className="text-muted">Showing 20 of {filteredData.length} records</p>
                  <Button variant="outline-primary">Load More</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AttendanceDashboard;
