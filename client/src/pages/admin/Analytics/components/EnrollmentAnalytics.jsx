import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EnrollmentAnalytics = () => {
  const [enrollmentData, setEnrollmentData] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: []
  });
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [dateRange, setDateRange] = useState([
    new Date(new Date().setMonth(new Date().getMonth() - 6)),
    new Date()
  ]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('line');

  // Mock data for development
  const mockEnrollmentData = {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(new Date().setDate(new Date().getDate() - 29 + i)).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 20) + 5
    })),
    weekly: Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      count: Math.floor(Math.random() * 100) + 30
    })),
    monthly: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2025, i, 1).toLocaleString('default', { month: 'short' }),
      count: Math.floor(Math.random() * 200) + 50,
      newStudents: Math.floor(Math.random() * 150) + 30,
      returningStudents: Math.floor(Math.random() * 50) + 20
    })),
    yearly: Array.from({ length: 5 }, (_, i) => ({
      year: 2021 + i,
      count: Math.floor(Math.random() * 1000) + 200
    }))
  };

  useEffect(() => {
    fetchEnrollmentData();
  }, [timeFrame, dateRange, fetchEnrollmentData]);

  const fetchEnrollmentData = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const formattedStartDate = startDate.toISOString().split('T')[0];
      // const formattedEndDate = endDate.toISOString().split('T')[0];
      // const response = await axios.get(
      //   `${process.env.REACT_APP_API_URL}/api/admin/analytics/enrollments?timeFrame=${timeFrame}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      // );
      // setEnrollmentData(response.data);

      // Using mock data for development
      setEnrollmentData(mockEnrollmentData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrollment data');
      setLoading(false);
    }
  };

  const getChartData = () => {
    let labels = [];
    let datasets = [];

    switch (timeFrame) {
      case 'daily':
        labels = enrollmentData.daily.map(item => item.date);
        datasets = [
          {
            label: 'Daily Enrollments',
            data: enrollmentData.daily.map(item => item.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
          }
        ];
        break;
      case 'weekly':
        labels = enrollmentData.weekly.map(item => item.week);
        datasets = [
          {
            label: 'Weekly Enrollments',
            data: enrollmentData.weekly.map(item => item.count),
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            tension: 0.1
          }
        ];
        break;
      case 'monthly':
        labels = enrollmentData.monthly.map(item => item.month);
        datasets = [
          {
            label: 'Total Enrollments',
            data: enrollmentData.monthly.map(item => item.count),
            fill: false,
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            tension: 0.1
          },
          {
            label: 'New Students',
            data: enrollmentData.monthly.map(item => item.newStudents),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
          },
          {
            label: 'Returning Students',
            data: enrollmentData.monthly.map(item => item.returningStudents),
            fill: false,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            tension: 0.1
          }
        ];
        break;
      case 'yearly':
        labels = enrollmentData.yearly.map(item => item.year.toString());
        datasets = [
          {
            label: 'Yearly Enrollments',
            data: enrollmentData.yearly.map(item => item.count),
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
          }
        ];
        break;
      default:
        break;
    }

    return { labels, datasets };
  };

  const chartData = getChartData();

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Course Enrollment ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Trend`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' enrollments';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Enrollments'
        }
      },
      x: {
        title: {
          display: true,
          text: timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)
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
        <h5 className="mb-0">Course Enrollment Analytics</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-4">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Time Frame</Form.Label>
              <Form.Select 
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date Range</Form.Label>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                className="form-control"
                placeholderText="Select date range"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Chart Type</Form.Label>
              <Form.Select 
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button 
              variant="primary" 
              onClick={fetchEnrollmentData}
              className="w-100"
            >
              Apply
            </Button>
          </Col>
        </Row>

        <div style={{ height: '400px' }}>
          {viewType === 'line' ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>

        <div className="mt-4">
          <h6>Key Insights:</h6>
          <ul>
            <li>
              <strong>Peak Enrollment Period:</strong> {timeFrame === 'monthly' ? 'August and January' : 'Weekends'} show the highest enrollment rates.
            </li>
            <li>
              <strong>Growth Trend:</strong> Overall {timeFrame} enrollments have increased by 23% compared to the previous period.
            </li>
            <li>
              <strong>New vs Returning:</strong> 68% of enrollments are from new students, while 32% are from returning students.
            </li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EnrollmentAnalytics;
