import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const RevenueAnalytics = () => {
  const [revenueData, setRevenueData] = useState({
    overview: {
      totalRevenue: 0,
      comparedToLastPeriod: 0,
      averageOrderValue: 0,
      refundRate: 0
    },
    byPeriod: [],
    byCategory: [],
    byPaymentMethod: []
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
  const mockRevenueData = useMemo(() => ({
    overview: {
      totalRevenue: 125750.45,
      comparedToLastPeriod: 15.3,
      averageOrderValue: 149.99,
      refundRate: 2.4
    },
    byPeriod: [
      { period: 'Jan', revenue: 18500.25, transactions: 123 },
      { period: 'Feb', revenue: 15750.50, transactions: 105 },
      { period: 'Mar', revenue: 21300.75, transactions: 142 },
      { period: 'Apr', revenue: 19800.30, transactions: 132 },
      { period: 'May', revenue: 22450.80, transactions: 150 },
      { period: 'Jun', revenue: 27950.85, transactions: 186 }
    ],
    byCategory: [
      { category: 'Web Development', revenue: 45250.50, percentage: 36 },
      { category: 'Data Science', revenue: 32500.75, percentage: 26 },
      { category: 'Mobile Development', revenue: 18750.30, percentage: 15 },
      { category: 'UI/UX Design', revenue: 15000.45, percentage: 12 },
      { category: 'Cloud Computing', revenue: 8750.25, percentage: 7 },
      { category: 'Other', revenue: 5500.20, percentage: 4 }
    ],
    byPaymentMethod: [
      { method: 'Credit Card', revenue: 75450.30, percentage: 60 },
      { method: 'PayPal', revenue: 31450.10, percentage: 25 },
      { method: 'Bank Transfer', revenue: 12575.05, percentage: 10 },
      { method: 'Other', revenue: 6275.00, percentage: 5 }
    ]
  }), []);

  const fetchRevenueData = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app:
      // const formattedStartDate = startDate.toISOString().split('T')[0];
      // const formattedEndDate = endDate.toISOString().split('T')[0];
      // const response = await axios.get(
      //   `${process.env.REACT_APP_API_URL}/api/admin/analytics/revenue?timeFrame=${timeFrame}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      // );
      // setRevenueData(response.data);

      // Using mock data for development
      setRevenueData(mockRevenueData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch revenue data');
      setLoading(false);
    }
  }, [mockRevenueData]);

  useEffect(() => {
    fetchRevenueData();
  }, [fetchRevenueData]);

  const getPeriodChartData = () => {
    return {
      labels: revenueData.byPeriod.map(item => item.period),
      datasets: [
        {
          label: 'Revenue',
          data: revenueData.byPeriod.map(item => item.revenue),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          yAxisID: 'y'
        },
        {
          label: 'Transactions',
          data: revenueData.byPeriod.map(item => item.transactions),
          fill: false,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          tension: 0.1,
          yAxisID: 'y1'
        }
      ]
    };
  };

  const getCategoryChartData = () => {
    return {
      labels: revenueData.byCategory.map(item => item.category),
      datasets: [
        {
          label: 'Revenue by Category',
          data: revenueData.byCategory.map(item => item.revenue),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getPaymentMethodChartData = () => {
    return {
      labels: revenueData.byPaymentMethod.map(item => item.method),
      datasets: [
        {
          label: 'Revenue by Payment Method',
          data: revenueData.byPaymentMethod.map(item => item.percentage),
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const periodChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Revenue and Transactions by ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}`
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Transactions'
        }
      }
    }
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue by Course Category'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = revenueData.byCategory[context.dataIndex].percentage;
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  const paymentMethodChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue by Payment Method'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const percentage = context.raw || 0;
            return `${label}: ${percentage}%`;
          }
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
        <h5 className="mb-0">Revenue Analytics</h5>
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
                <option value="quarterly">Quarterly</option>
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
              onClick={fetchRevenueData}
              className="w-100"
            >
              Apply
            </Button>
          </Col>
        </Row>

        {/* Revenue Overview Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Total Revenue</h6>
                <h3 className="mb-0">${revenueData.overview.totalRevenue.toLocaleString()}</h3>
                <div className={`mt-2 ${revenueData.overview.comparedToLastPeriod >= 0 ? 'text-success' : 'text-danger'}`}>
                  {revenueData.overview.comparedToLastPeriod >= 0 ? (
                    <><FaArrowUp /> {revenueData.overview.comparedToLastPeriod}%</>
                  ) : (
                    <><FaArrowDown /> {Math.abs(revenueData.overview.comparedToLastPeriod)}%</>
                  )}
                  <span className="text-muted ms-1">vs last period</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Average Order Value</h6>
                <h3 className="mb-0">${revenueData.overview.averageOrderValue.toLocaleString()}</h3>
                <div className="mt-2 text-muted">
                  Per transaction
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Total Transactions</h6>
                <h3 className="mb-0">
                  {revenueData.byPeriod.reduce((sum, item) => sum + item.transactions, 0)}
                </h3>
                <div className="mt-2 text-muted">
                  In selected period
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center">
                <h6 className="text-muted mb-2">Refund Rate</h6>
                <h3 className="mb-0">{revenueData.overview.refundRate}%</h3>
                <div className="mt-2 text-muted">
                  Of total transactions
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Revenue by Period Chart */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div style={{ height: '300px' }}>
                  {viewType === 'line' ? (
                    <Line data={getPeriodChartData()} options={periodChartOptions} />
                  ) : (
                    <Bar data={getPeriodChartData()} options={periodChartOptions} />
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Revenue by Category and Payment Method */}
        <Row>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Revenue by Course Category</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }}>
                  <Bar data={getCategoryChartData()} options={categoryChartOptions} />
                </div>
                <Table className="mt-3" size="sm">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Revenue</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.byCategory.map((item, index) => (
                      <tr key={index}>
                        <td>{item.category}</td>
                        <td>${item.revenue.toLocaleString()}</td>
                        <td>{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent">
                <h6 className="mb-0">Revenue by Payment Method</h6>
              </Card.Header>
              <Card.Body>
                <div style={{ height: '250px' }}>
                  <Pie data={getPaymentMethodChartData()} options={paymentMethodChartOptions} />
                </div>
                <Table className="mt-3" size="sm">
                  <thead>
                    <tr>
                      <th>Payment Method</th>
                      <th>Revenue</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.byPaymentMethod.map((item, index) => (
                      <tr key={index}>
                        <td>{item.method}</td>
                        <td>${item.revenue.toLocaleString()}</td>
                        <td>{item.percentage}%</td>
                      </tr>
                    ))}
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

export default RevenueAnalytics;
