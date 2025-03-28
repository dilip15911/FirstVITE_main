import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Table, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const PaymentSettings = () => {
  const [paymentGateways, setPaymentGateways] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingGateway, setEditingGateway] = useState(null);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [newGateway, setNewGateway] = useState({
    name: '',
    type: 'credit_card',
    apiKey: '',
    secretKey: '',
    isActive: true
  });
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1.0,
    isDefault: false
  });

  // Mock data for development
  const mockPaymentGateways = [
    {
      id: 1,
      name: 'Stripe',
      type: 'credit_card',
      apiKey: 'pk_test_*****',
      secretKey: 'sk_test_*****',
      isActive: true,
      lastUpdated: '2025-03-01T10:00:00'
    },
    {
      id: 2,
      name: 'PayPal',
      type: 'paypal',
      apiKey: 'client_id_*****',
      secretKey: 'client_secret_*****',
      isActive: true,
      lastUpdated: '2025-03-01T10:00:00'
    },
    {
      id: 3,
      name: 'Bank Transfer',
      type: 'bank_transfer',
      accountDetails: 'Bank: Example Bank\nAccount: 1234567890\nIFSC: EXMPL1234',
      isActive: true,
      lastUpdated: '2025-03-01T10:00:00'
    }
  ];

  const mockCurrencies = [
    {
      id: 1,
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      exchangeRate: 1.0,
      isDefault: true,
      lastUpdated: '2025-03-01T10:00:00'
    },
    {
      id: 2,
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      exchangeRate: 0.92,
      isDefault: false,
      lastUpdated: '2025-03-01T10:00:00'
    },
    {
      id: 3,
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      exchangeRate: 83.25,
      isDefault: false,
      lastUpdated: '2025-03-01T10:00:00'
    }
  ];

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const gatewaysResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/payments/gateways`);
      // const currenciesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/payments/currencies`);
      // setPaymentGateways(gatewaysResponse.data);
      // setCurrencies(currenciesResponse.data);
      
      // Using mock data for development
      setPaymentGateways(mockPaymentGateways);
      setCurrencies(mockCurrencies);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch payment settings');
      setLoading(false);
    }
  };

  const handleSaveGateway = async (gateway) => {
    try {
      // In a real app:
      // if (gateway.id) {
      //   await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/payments/gateways/${gateway.id}`, gateway);
      // } else {
      //   await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/payments/gateways`, gateway);
      // }
      
      // For development, update the mock data
      if (gateway.id) {
        const updatedGateways = paymentGateways.map(g => 
          g.id === gateway.id ? { ...gateway, lastUpdated: new Date().toISOString() } : g
        );
        setPaymentGateways(updatedGateways);
      } else {
        const newId = Math.max(...paymentGateways.map(g => g.id)) + 1;
        setPaymentGateways([
          ...paymentGateways, 
          { ...gateway, id: newId, lastUpdated: new Date().toISOString() }
        ]);
      }
      
      setEditingGateway(null);
      setNewGateway({
        name: '',
        type: 'credit_card',
        apiKey: '',
        secretKey: '',
        isActive: true
      });
      setSuccess('Payment gateway saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save payment gateway');
    }
  };

  const handleSaveCurrency = async (currency) => {
    try {
      // In a real app:
      // if (currency.id) {
      //   await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/payments/currencies/${currency.id}`, currency);
      // } else {
      //   await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/payments/currencies`, currency);
      // }
      
      // For development, update the mock data
      if (currency.id) {
        const updatedCurrencies = currencies.map(c => 
          c.id === currency.id ? { ...currency, lastUpdated: new Date().toISOString() } : c
        );
        setCurrencies(updatedCurrencies);
      } else {
        const newId = Math.max(...currencies.map(c => c.id)) + 1;
        setCurrencies([
          ...currencies, 
          { ...currency, id: newId, lastUpdated: new Date().toISOString() }
        ]);
      }
      
      setEditingCurrency(null);
      setNewCurrency({
        code: '',
        name: '',
        symbol: '',
        exchangeRate: 1.0,
        isDefault: false
      });
      setSuccess('Currency saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to save currency');
    }
  };

  const handleDeleteGateway = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment gateway?')) {
      try {
        // In a real app:
        // await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/payments/gateways/${id}`);
        
        // For development, update the mock data
        setPaymentGateways(paymentGateways.filter(g => g.id !== id));
        setSuccess('Payment gateway deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete payment gateway');
      }
    }
  };

  const handleDeleteCurrency = async (id) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      try {
        // In a real app:
        // await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/payments/currencies/${id}`);
        
        // For development, update the mock data
        setCurrencies(currencies.filter(c => c.id !== id));
        setSuccess('Currency deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete currency');
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

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Payment Gateways</h5>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setEditingGateway('new')}
            disabled={editingGateway === 'new'}
          >
            <FaPlus className="me-1" /> Add Gateway
          </Button>
        </Card.Header>
        <Card.Body>
          {editingGateway === 'new' && (
            <Card className="mb-3 border-primary">
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gateway Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={newGateway.name}
                          onChange={(e) => setNewGateway({...newGateway, name: e.target.value})}
                          placeholder="e.g. Stripe, PayPal"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gateway Type</Form.Label>
                        <Form.Select
                          value={newGateway.type}
                          onChange={(e) => setNewGateway({...newGateway, type: e.target.value})}
                        >
                          <option value="credit_card">Credit Card</option>
                          <option value="paypal">PayPal</option>
                          <option value="bank_transfer">Bank Transfer</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={newGateway.isActive}
                          onChange={(e) => setNewGateway({...newGateway, isActive: e.target.value === 'true'})}
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {newGateway.type !== 'bank_transfer' ? (
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>API Key / Client ID</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={newGateway.apiKey}
                            onChange={(e) => setNewGateway({...newGateway, apiKey: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Secret Key / Client Secret</Form.Label>
                          <Form.Control 
                            type="password" 
                            value={newGateway.secretKey}
                            onChange={(e) => setNewGateway({...newGateway, secretKey: e.target.value})}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Label>Account Details</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3}
                        value={newGateway.accountDetails || ''}
                        onChange={(e) => setNewGateway({...newGateway, accountDetails: e.target.value})}
                        placeholder="Bank name, account number, IFSC code, etc."
                      />
                    </Form.Group>
                  )}
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="secondary" 
                      className="me-2"
                      onClick={() => {
                        setEditingGateway(null);
                        setNewGateway({
                          name: '',
                          type: 'credit_card',
                          apiKey: '',
                          secretKey: '',
                          isActive: true
                        });
                      }}
                    >
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => handleSaveGateway(newGateway)}
                      disabled={!newGateway.name}
                    >
                      <FaSave className="me-1" /> Save Gateway
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
          
          <Table responsive>
            <thead>
              <tr>
                <th>Gateway</th>
                <th>Type</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentGateways.map(gateway => (
                <tr key={gateway.id}>
                  <td>{gateway.name}</td>
                  <td>{gateway.type.replace('_', ' ').toUpperCase()}</td>
                  <td>
                    {gateway.isActive ? (
                      <Badge bg="success">Active</Badge>
                    ) : (
                      <Badge bg="secondary">Inactive</Badge>
                    )}
                  </td>
                  <td>{new Date(gateway.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1"
                      onClick={() => setEditingGateway(gateway.id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteGateway(gateway.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Currencies</h5>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setEditingCurrency('new')}
            disabled={editingCurrency === 'new'}
          >
            <FaPlus className="me-1" /> Add Currency
          </Button>
        </Card.Header>
        <Card.Body>
          {editingCurrency === 'new' && (
            <Card className="mb-3 border-primary">
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Currency Code</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={newCurrency.code}
                          onChange={(e) => setNewCurrency({...newCurrency, code: e.target.value.toUpperCase()})}
                          placeholder="e.g. USD, EUR"
                          maxLength={3}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Currency Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={newCurrency.name}
                          onChange={(e) => setNewCurrency({...newCurrency, name: e.target.value})}
                          placeholder="e.g. US Dollar"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Symbol</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={newCurrency.symbol}
                          onChange={(e) => setNewCurrency({...newCurrency, symbol: e.target.value})}
                          placeholder="e.g. $, €"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Exchange Rate</Form.Label>
                        <Form.Control 
                          type="number" 
                          step="0.01"
                          value={newCurrency.exchangeRate}
                          onChange={(e) => setNewCurrency({...newCurrency, exchangeRate: parseFloat(e.target.value)})}
                          placeholder="1.0"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Default</Form.Label>
                        <Form.Select
                          value={newCurrency.isDefault}
                          onChange={(e) => setNewCurrency({...newCurrency, isDefault: e.target.value === 'true'})}
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="secondary" 
                      className="me-2"
                      onClick={() => {
                        setEditingCurrency(null);
                        setNewCurrency({
                          code: '',
                          name: '',
                          symbol: '',
                          exchangeRate: 1.0,
                          isDefault: false
                        });
                      }}
                    >
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                    <Button 
                      variant="primary"
                      onClick={() => handleSaveCurrency(newCurrency)}
                      disabled={!newCurrency.code || !newCurrency.name || !newCurrency.symbol}
                    >
                      <FaSave className="me-1" /> Save Currency
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          )}
          
          <Table responsive>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Exchange Rate</th>
                <th>Default</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map(currency => (
                <tr key={currency.id}>
                  <td>{currency.code}</td>
                  <td>{currency.name}</td>
                  <td>{currency.symbol}</td>
                  <td>{currency.exchangeRate.toFixed(2)}</td>
                  <td>
                    {currency.isDefault ? (
                      <Badge bg="success">Yes</Badge>
                    ) : (
                      <Badge bg="secondary">No</Badge>
                    )}
                  </td>
                  <td>{new Date(currency.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1"
                      onClick={() => setEditingCurrency(currency.id)}
                    >
                      <FaEdit />
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteCurrency(currency.id)}
                      disabled={currency.isDefault}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default PaymentSettings;
