import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import '../../styles/adminTheme.css';
import './Courses.css';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [purchaseData, setPurchaseData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'credit_card',
        comments: ''
    });
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [purchaseError, setPurchaseError] = useState(null);

    const fetchCourseDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(`/courses/${courseId}`);
            setCourse(response.data.course);
            setError(null);
        } catch (err) {
            console.error('Error fetching course details:', err);
            setError('Failed to fetch course details. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    const handlePurchase = async (e) => {
        e.preventDefault();
        setPurchaseError(null);
        setPurchaseLoading(true);

        try {
            await api.post(`/courses/${courseId}/purchase`, purchaseData);
            setShowPurchaseForm(false);
            setPurchaseLoading(false);
            alert('Purchase successful! You will receive an email with course details shortly.');
            navigate('/courses');
        } catch (err) {
            console.error('Error purchasing course:', err);
            setPurchaseError('Purchase failed. Please check your details and try again.');
            setPurchaseLoading(false);
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
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                    <div className="mt-3">
                        <button 
                            className="btn btn-primary"
                            onClick={() => fetchCourseDetails()}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning" role="alert">
                    Course not found. Please check the course ID and try again.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8">
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h3>{course.title}</h3>
                            <p className="text-muted">{course.description}</p>
                        </div>
                        <div className="admin-card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <h5>Course Overview</h5>
                                        <p><strong>Duration:</strong> {course.duration} weeks</p>
                                        <p><strong>Cohort Start:</strong> {course.startDate}</p>
                                        <p><strong>Price:</strong> ${course.price}</p>
                                        <p><strong>Enrolled Students:</strong> {course.enrolledStudents}</p>
                                        <p><strong>Language:</strong> {course.language}</p>
                                        <p><strong>Level:</strong> {course.level}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-4">
                                        <h5>Course Objectives</h5>
                                        <ul className="list-group">
                                            {course.objectives.map((obj, index) => (
                                                <li key={index} className="list-group-item">
                                                    <i className="fas fa-check text-success me-2"></i>
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h5>What You'll Learn</h5>
                                <ul>
                                    {course.learningOutcomes.map((outcome, index) => (
                                        <li key={index} className="mb-2">
                                            <i className="fas fa-circle text-primary me-2"></i>
                                            {outcome}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="admin-card-footer">
                            <button 
                                className="btn btn-primary me-2" 
                                onClick={() => setShowPurchaseForm(true)}
                            >
                                Enroll Now
                            </button>
                            <button 
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    alert('Course added to your wishlist!');
                                }}
                            >
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="admin-card">
                        <div className="admin-card-header">
                            <h5>Course Highlights</h5>
                        </div>
                        <div className="admin-card-body">
                            <ul className="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Course Duration</span>
                                    <span className="badge bg-primary">{course.duration} weeks</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Price</span>
                                    <span className="badge bg-success">${course.price}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Start Date</span>
                                    <span className="badge bg-info">{course.startDate}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Available Seats</span>
                                    <span className="badge bg-warning">{course.availableSeats}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Rating</span>
                                    <span className="badge bg-info">
                                        {course.rating} <i className="fas fa-star text-warning"></i>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Form Modal */}
            {showPurchaseForm && (
                <div className="modal fade show" style={{ display: 'block' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Enrollment Form</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowPurchaseForm(false)}
                                />
                            </div>
                            <div className="modal-body">
                                {purchaseError && (
                                    <div className="alert alert-danger" role="alert">
                                        {purchaseError}
                                    </div>
                                )}
                                <form onSubmit={handlePurchase} className="needs-validation" noValidate>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={purchaseData.fullName}
                                                onChange={(e) => setPurchaseData({ ...purchaseData, fullName: e.target.value })}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Please enter your full name
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                value={purchaseData.email}
                                                onChange={(e) => setPurchaseData({ ...purchaseData, email: e.target.value })}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Please enter a valid email address
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Phone</label>
                                            <input 
                                                type="tel" 
                                                className="form-control" 
                                                value={purchaseData.phone}
                                                onChange={(e) => setPurchaseData({ ...purchaseData, phone: e.target.value })}
                                                required
                                            />
                                            <div className="invalid-feedback">
                                                Please enter your phone number
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Payment Method</label>
                                            <select 
                                                className="form-control" 
                                                value={purchaseData.paymentMethod}
                                                onChange={(e) => setPurchaseData({ ...purchaseData, paymentMethod: e.target.value })}
                                                required
                                            >
                                                <option value="credit_card">Credit Card</option>
                                                <option value="debit_card">Debit Card</option>
                                                <option value="net_banking">Net Banking</option>
                                                <option value="upi">UPI</option>
                                                <option value="cash_on_delivery">Cash on Delivery</option>
                                            </select>
                                            <div className="invalid-feedback">
                                                Please select a payment method
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Address</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="3"
                                            value={purchaseData.address}
                                            onChange={(e) => setPurchaseData({ ...purchaseData, address: e.target.value })}
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter your address
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Additional Comments</label>
                                        <textarea 
                                            className="form-control" 
                                            rows="2"
                                            placeholder="Any special requirements or questions?"
                                            value={purchaseData.comments}
                                            onChange={(e) => setPurchaseData({ ...purchaseData, comments: e.target.value })}
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => setShowPurchaseForm(false)}
                                        >
                                            Close
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={purchaseLoading}
                                        >
                                            {purchaseLoading ? 'Processing...' : 'Enroll Now'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
