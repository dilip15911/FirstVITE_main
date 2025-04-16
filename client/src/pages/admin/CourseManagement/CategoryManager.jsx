import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Modal,
    Form,
    Alert,
    Table,
    Image,
    Spinner
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Form states
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);
    const [categoryImagePreview, setCategoryImagePreview] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/categories`);
            const data = response.data;
            if (data.success) {
                setCategories(data.data || []);
            } else {
                throw new Error(data.message || 'Failed to load categories');
            }
        } catch (err) {
            console.error('Error loading categories:', err);
            setError(err.response?.data?.message || 'Failed to load categories');
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryImagePreview(reader.result);
                setCategoryImage(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const createCategory = async () => {
        if (!categoryName.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', categoryName);
            formData.append('description', categoryDescription);
            if (categoryImage) {
                formData.append('image', categoryImage);
            }

            const response = await axios.post(
                `${API_URL}/api/admin/categories`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Category created successfully!');
                setShowAddModal(false);
                setCategoryName('');
                setCategoryDescription('');
                setCategoryImage(null);
                setCategoryImagePreview(null);
                loadCategories();
            } else {
                throw new Error(response.data.message || 'Failed to create category');
            }
        } catch (err) {
            console.error('Error creating category:', err);
            toast.error(err.response?.data?.message || 'Failed to create category');
        } finally {
            setLoading(false);
        }
    };

    const updateCategory = async () => {
        if (!selectedCategory || !categoryName.trim()) {
            toast.error('Please select a category to update');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('name', categoryName);
            formData.append('description', categoryDescription);
            if (categoryImage) {
                formData.append('image', categoryImage);
            }

            const response = await axios.put(
                `${API_URL}/api/admin/categories/${selectedCategory.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Category updated successfully!');
                setShowEditModal(false);
                setSelectedCategory(null);
                setCategoryName('');
                setCategoryDescription('');
                setCategoryImage(null);
                setCategoryImagePreview(null);
                loadCategories();
            } else {
                throw new Error(response.data.message || 'Failed to update category');
            }
        } catch (err) {
            console.error('Error updating category:', err);
            toast.error(err.response?.data?.message || 'Failed to update category');
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.delete(
                `${API_URL}/api/admin/categories/${categoryId}`
            );

            if (response.data.success) {
                toast.success('Category deleted successfully!');
                loadCategories();
            } else {
                throw new Error(response.data.message || 'Failed to delete category');
            }
        } catch (err) {
            console.error('Error deleting category:', err);
            toast.error(err.response?.data?.message || 'Failed to delete category');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
        setCategoryImagePreview(category.image_url);
        setShowEditModal(true);
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container fluid>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Category Management</h2>
                <Button 
                    variant="primary" 
                    onClick={() => setShowAddModal(true)}
                >
                    <FaPlus className="me-2" /> Add New Category
                </Button>
            </div>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Table responsive striped>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) => (
                                <tr key={category.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{category.name}</strong>
                                        <div className="text-muted small">{category.description}</div>
                                    </td>
                                    <td>{category.description}</td>
                                    <td>
                                        {category.image_url && (
                                            <Image
                                                src={category.image_url}
                                                thumbnail
                                                style={{ maxWidth: '50px', maxHeight: '50px' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        {new Date(category.created_at).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Button 
                                            variant="info" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => deleteCategory(category.id)}
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

            {/* Add Category Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="categoryName" className="mb-3">
                            <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Enter category name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="categoryDescription" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                placeholder="Enter category description"
                            />
                        </Form.Group>

                        <Form.Group controlId="categoryImage" className="mb-3">
                            <Form.Label>Category Image</Form.Label>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="me-2"
                                />
                                {categoryImagePreview && (
                                    <Image
                                        src={categoryImagePreview}
                                        thumbnail
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    />
                                )}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={createCategory} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Creating...
                            </>
                        ) : (
                            'Create Category'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Category Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="editCategoryName" className="mb-3">
                            <Form.Label>Category Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Enter category name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="editCategoryDescription" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={categoryDescription}
                                onChange={(e) => setCategoryDescription(e.target.value)}
                                placeholder="Enter category description"
                            />
                        </Form.Group>

                        <Form.Group controlId="editCategoryImage" className="mb-3">
                            <Form.Label>Category Image</Form.Label>
                            <div className="d-flex align-items-center">
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="me-2"
                                />
                                {categoryImagePreview && (
                                    <Image
                                        src={categoryImagePreview}
                                        thumbnail
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    />
                                )}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={updateCategory} disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Updating...
                            </>
                        ) : (
                            'Update Category'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CategoryManager;
