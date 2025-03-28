import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Tab, Nav, Modal } from 'react-bootstrap';
import { FaMoneyBillWave, FaUserGraduate, FaChalkboardTeacher, FaCreditCard, FaFileInvoice, FaEdit, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RefundManagement from './components/RefundManagement';
import PaymentSettings from './components/PaymentSettings';

const PaymentDashboard = () => {
    const [activeTab, setActiveTab] = useState('transactions');
    const [transactions, setTransactions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState([new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]);
    const [startDate, endDate] = dateRange;
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab, dateRange]);

    const fetchData = async (type) => {
        try {
            setLoading(true);
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
            
            let endpoint;
            switch (type) {
                case 'transactions':
                    endpoint = `payments/transactions?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
                    break;
                case 'subscriptions':
                    endpoint = `payments/subscriptions?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
                    break;
                case 'payouts':
                    endpoint = `payments/payouts?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
                    break;
                case 'refunds':
                    endpoint = `payments/refunds?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
                    break;
                case 'settings':
                    endpoint = `payments/settings`;
                    break;
                default:
                    endpoint = `payments/transactions?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
            }
            
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/${endpoint}`);
            
            switch (type) {
                case 'transactions':
                    setTransactions(response.data);
                    break;
                case 'subscriptions':
                    setSubscriptions(response.data);
                    break;
                case 'payouts':
                    setPayouts(response.data);
                    break;
                case 'refunds':
                    setTransactions(response.data);
                    break;
                case 'settings':
                    break;
            }
            
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleRefund = async (id) => {
        if (window.confirm('Are you sure you want to process this refund?')) {
            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/payments/refund/${id}`);
                fetchData(activeTab);
            } catch (err) {
                setError('Failed to process refund');
            }
        }
    };

    const handlePayout = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/payments/process-payout/${id}`);
            fetchData('payouts');
        } catch (err) {
            setError('Failed to process payout');
        }
    };

    const handleViewDetails = (item) => {
        setCurrentItem(item);
        setShowModal(true);
    };

    const filteredData = () => {
        switch (activeTab) {
            case 'transactions':
                return transactions.filter(item => 
                    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
                );
            case 'subscriptions':
                return subscriptions.filter(item => 
                    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.plan.toLowerCase().includes(searchTerm.toLowerCase())
                );
            case 'payouts':
                return payouts.filter(item => 
                    item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.payoutId.toLowerCase().includes(searchTerm.toLowerCase())
                );
            case 'refunds':
                return transactions.filter(item => 
                    item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
                );
            default:
                return [];
        }
    };

    const renderSummaryCards = () => {
        let totalRevenue = 0;
        let totalRefunds = 0;
        let totalPayouts = 0;
        let activeSubscriptions = 0;

        if (activeTab === 'transactions') {
            totalRevenue = transactions.reduce((sum, item) => sum + (item.status === 'completed' ? item.amount : 0), 0);
            totalRefunds = transactions.reduce((sum, item) => sum + (item.status === 'refunded' ? item.amount : 0), 0);
        } else if (activeTab === 'subscriptions') {
            activeSubscriptions = subscriptions.filter(item => item.status === 'active').length;
            totalRevenue = subscriptions.reduce((sum, item) => sum + item.amount, 0);
        } else if (activeTab === 'payouts') {
            totalPayouts = payouts.reduce((sum, item) => sum + item.amount, 0);
        }

        return (
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <FaMoneyBillWave className="mb-3" size={30} color="#4e73df" />
                            <h3>${totalRevenue.toFixed(2)}</h3>
                            <Card.Text>Total Revenue</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            {activeTab === 'subscriptions' ? (
                                <>
                                    <FaUserGraduate className="mb-3" size={30} color="#1cc88a" />
                                    <h3>{activeSubscriptions}</h3>
                                    <Card.Text>Active Subscriptions</Card.Text>
                                </>
                            ) : activeTab === 'payouts' ? (
                                <>
                                    <FaChalkboardTeacher className="mb-3" size={30} color="#1cc88a" />
                                    <h3>${totalPayouts.toFixed(2)}</h3>
                                    <Card.Text>Total Payouts</Card.Text>
                                </>
                            ) : (
                                <>
                                    <FaCreditCard className="mb-3" size={30} color="#1cc88a" />
                                    <h3>${totalRefunds.toFixed(2)}</h3>
                                    <Card.Text>Total Refunds</Card.Text>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center">
                        <Card.Body>
                            <FaFileInvoice className="mb-3" size={30} color="#36b9cc" />
                            <h3>{
                                activeTab === 'transactions' ? transactions.length :
                                activeTab === 'subscriptions' ? subscriptions.length :
                                payouts.length
                            }</h3>
                            <Card.Text>Total {
                                activeTab === 'transactions' ? 'Transactions' :
                                activeTab === 'subscriptions' ? 'Subscriptions' :
                                'Payouts'
                            }</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    const renderRevenueChart = () => {
        // Group transactions by date
        const groupedData = {};
        
        transactions.forEach(transaction => {
            const date = transaction.date.split('T')[0];
            if (!groupedData[date]) {
                groupedData[date] = 0;
            }
            if (transaction.status === 'completed') {
                groupedData[date] += transaction.amount;
            }
        });

        const sortedDates = Object.keys(groupedData).sort();
        
        const chartData = {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Daily Revenue',
                    data: sortedDates.map(date => groupedData[date]),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        };

        return (
            <Card className="mb-4">
                <Card.Header>Revenue Trend</Card.Header>
                <Card.Body>
                    <Line data={chartData} options={{
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                        }
                    }} />
                </Card.Body>
            </Card>
        );
    };

    const renderTransactionsTable = () => {
        return (
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Student</th>
                        <th>Course</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData().map(transaction => (
                        <tr key={transaction.id}>
                            <td>{transaction.transactionId}</td>
                            <td>{transaction.student}</td>
                            <td>{transaction.course}</td>
                            <td>${transaction.amount.toFixed(2)}</td>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.paymentMethod}</td>
                            <td>
                                <Badge bg={
                                    transaction.status === 'completed' ? 'success' :
                                    transaction.status === 'pending' ? 'warning' :
                                    transaction.status === 'refunded' ? 'danger' : 'secondary'
                                }>
                                    {transaction.status}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleViewDetails(transaction)}
                                >
                                    <FaSearch />
                                </Button>
                                {transaction.status === 'completed' && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRefund(transaction.id)}
                                    >
                                        Refund
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderSubscriptionsTable = () => {
        return (
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Subscription ID</th>
                        <th>Student</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Start Date</th>
                        <th>Next Billing</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData().map(subscription => (
                        <tr key={subscription.id}>
                            <td>{subscription.subscriptionId}</td>
                            <td>{subscription.student}</td>
                            <td>{subscription.plan}</td>
                            <td>${subscription.amount.toFixed(2)}</td>
                            <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                            <td>{new Date(subscription.nextBillingDate).toLocaleDateString()}</td>
                            <td>
                                <Badge bg={
                                    subscription.status === 'active' ? 'success' :
                                    subscription.status === 'paused' ? 'warning' :
                                    'secondary'
                                }>
                                    {subscription.status}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleViewDetails(subscription)}
                                >
                                    <FaSearch />
                                </Button>
                                <Button
                                    variant="warning"
                                    size="sm"
                                >
                                    <FaEdit />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderPayoutsTable = () => {
        return (
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>Payout ID</th>
                        <th>Instructor</th>
                        <th>Amount</th>
                        <th>Courses</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData().map(payout => (
                        <tr key={payout.id}>
                            <td>{payout.payoutId}</td>
                            <td>{payout.instructor}</td>
                            <td>${payout.amount.toFixed(2)}</td>
                            <td>{payout.courseCount}</td>
                            <td>{payout.date ? new Date(payout.date).toLocaleDateString() : 'Pending'}</td>
                            <td>
                                <Badge bg={
                                    payout.status === 'completed' ? 'success' :
                                    payout.status === 'pending' ? 'warning' :
                                    'secondary'
                                }>
                                    {payout.status}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="info"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleViewDetails(payout)}
                                >
                                    <FaSearch />
                                </Button>
                                {payout.status === 'pending' && (
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handlePayout(payout.id)}
                                    >
                                        Process
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    };

    const renderRefundsTable = () => {
        return (
            <RefundManagement />
        );
    };

    const renderSettings = () => {
        return (
            <PaymentSettings />
        );
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <Container fluid>
            <h2 className="mb-4">Payment Management</h2>

            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Row className="mb-4">
                    <Col>
                        <Card>
                            <Card.Body>
                                <Nav variant="pills" className="mb-3">
                                    <Nav.Item>
                                        <Nav.Link eventKey="transactions">Transactions</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="subscriptions">Subscriptions</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="payouts">Instructor Payouts</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="refunds">Refund Requests</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="settings">Payment Settings</Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Date Range</Form.Label>
                                            <DatePicker
                                                selectsRange={true}
                                                startDate={startDate}
                                                endDate={endDate}
                                                onChange={(update) => setDateRange(update)}
                                                className="form-control"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Search</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Search by name, ID, or course"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Tab.Content>
                    <Tab.Pane eventKey={activeTab}>
                        {renderSummaryCards()}
                        
                        {activeTab === 'transactions' && renderRevenueChart()}
                        
                        <Card>
                            <Card.Header>
                                {activeTab === 'transactions' ? 'Transaction History' :
                                 activeTab === 'subscriptions' ? 'Active Subscriptions' :
                                 activeTab === 'payouts' ? 'Instructor Payouts' :
                                 activeTab === 'refunds' ? 'Refund Requests' :
                                 'Payment Settings'}
                            </Card.Header>
                            <Card.Body>
                                {activeTab === 'transactions' && renderTransactionsTable()}
                                {activeTab === 'subscriptions' && renderSubscriptionsTable()}
                                {activeTab === 'payouts' && renderPayoutsTable()}
                                {activeTab === 'refunds' && renderRefundsTable()}
                                {activeTab === 'settings' && renderSettings()}
                            </Card.Body>
                        </Card>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>

            {/* Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {activeTab === 'transactions' ? 'Transaction Details' :
                         activeTab === 'subscriptions' ? 'Subscription Details' :
                         activeTab === 'payouts' ? 'Payout Details' :
                         activeTab === 'refunds' ? 'Refund Details' :
                         'Payment Settings'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentItem && (
                        <div>
                            <Row>
                                <Col md={6}>
                                    <p><strong>ID:</strong> {
                                        activeTab === 'transactions' ? currentItem.transactionId :
                                        activeTab === 'subscriptions' ? currentItem.subscriptionId :
                                        activeTab === 'payouts' ? currentItem.payoutId :
                                        currentItem.transactionId
                                    }</p>
                                    <p><strong>Amount:</strong> ${currentItem.amount.toFixed(2)}</p>
                                    <p><strong>Status:</strong> {currentItem.status}</p>
                                    <p><strong>Date:</strong> {new Date(
                                        activeTab === 'subscriptions' ? currentItem.startDate : currentItem.date
                                    ).toLocaleDateString()}</p>
                                </Col>
                                <Col md={6}>
                                    {activeTab === 'transactions' && (
                                        <>
                                            <p><strong>Student:</strong> {currentItem.student}</p>
                                            <p><strong>Course:</strong> {currentItem.course}</p>
                                            <p><strong>Payment Method:</strong> {currentItem.paymentMethod}</p>
                                        </>
                                    )}
                                    {activeTab === 'subscriptions' && (
                                        <>
                                            <p><strong>Student:</strong> {currentItem.student}</p>
                                            <p><strong>Plan:</strong> {currentItem.plan}</p>
                                            <p><strong>Next Billing:</strong> {new Date(currentItem.nextBillingDate).toLocaleDateString()}</p>
                                        </>
                                    )}
                                    {activeTab === 'payouts' && (
                                        <>
                                            <p><strong>Instructor:</strong> {currentItem.instructor}</p>
                                            <p><strong>Course Count:</strong> {currentItem.courseCount}</p>
                                            <p><strong>Payment Method:</strong> {currentItem.paymentMethod}</p>
                                        </>
                                    )}
                                    {activeTab === 'refunds' && (
                                        <>
                                            <p><strong>Student:</strong> {currentItem.student}</p>
                                            <p><strong>Course:</strong> {currentItem.course}</p>
                                            <p><strong>Payment Method:</strong> {currentItem.paymentMethod}</p>
                                        </>
                                    )}
                                </Col>
                            </Row>

                            {activeTab === 'transactions' && currentItem.items && (
                                <div className="mt-4">
                                    <h5>Items</h5>
                                    <Table responsive striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItem.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>${item.price.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}

                            {activeTab === 'payouts' && currentItem.courses && (
                                <div className="mt-4">
                                    <h5>Courses</h5>
                                    <Table responsive striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Course</th>
                                                <th>Students</th>
                                                <th>Revenue</th>
                                                <th>Payout</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItem.courses.map((course, index) => (
                                                <tr key={index}>
                                                    <td>{course.title}</td>
                                                    <td>{course.students}</td>
                                                    <td>${course.revenue.toFixed(2)}</td>
                                                    <td>${course.payout.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    {activeTab === 'transactions' && currentItem?.status === 'completed' && (
                        <Button variant="danger" onClick={() => {
                            handleRefund(currentItem.id);
                            setShowModal(false);
                        }}>
                            Process Refund
                        </Button>
                    )}
                    {activeTab === 'payouts' && currentItem?.status === 'pending' && (
                        <Button variant="success" onClick={() => {
                            handlePayout(currentItem.id);
                            setShowModal(false);
                        }}>
                            Process Payout
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PaymentDashboard;
