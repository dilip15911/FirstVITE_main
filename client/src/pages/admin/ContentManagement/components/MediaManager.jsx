import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table, Badge, Modal, Spinner, Image } from 'react-bootstrap';
import { FaImage, FaVideo, FaFileAudio, FaPlus, FaEdit, FaTrash, FaDownload, FaSearch, FaFilter, FaEye, FaPlay } from 'react-icons/fa';
import axios from 'axios';
import Dropzone from 'react-dropzone';

const MediaManager = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Mock data for development
  const mockMediaItems = [
    {
      id: 1,
      title: 'Introduction to React',
      description: 'Cover image for React course',
      type: 'image',
      category: 'Course Thumbnails',
      url: 'https://via.placeholder.com/800x450?text=React+Course',
      fileSize: 245000,
      dimensions: '800x450',
      createdAt: '2025-01-15T10:30:00',
      updatedAt: '2025-03-10T14:20:00'
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      description: 'Introductory video for JavaScript course',
      type: 'video',
      category: 'Course Videos',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      fileSize: 15000000,
      duration: '10:15',
      createdAt: '2025-02-05T09:15:00',
      updatedAt: '2025-03-01T11:45:00'
    },
    {
      id: 3,
      title: 'Data Science Overview',
      description: 'Thumbnail for data science course',
      type: 'image',
      category: 'Course Thumbnails',
      url: 'https://via.placeholder.com/800x450?text=Data+Science+Course',
      fileSize: 320000,
      dimensions: '800x450',
      createdAt: '2025-01-20T13:25:00',
      updatedAt: '2025-02-15T16:30:00'
    },
    {
      id: 4,
      title: 'Python Programming Tutorial',
      description: 'Introduction to Python programming',
      type: 'video',
      category: 'Course Videos',
      url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
      fileSize: 25000000,
      duration: '15:30',
      createdAt: '2025-02-10T15:30:00',
      updatedAt: '2025-03-05T09:45:00'
    },
    {
      id: 5,
      title: 'Meditation for Focus',
      description: 'Background audio for focus sessions',
      type: 'audio',
      category: 'Background Audio',
      url: 'https://example.com/audio/meditation.mp3',
      fileSize: 5000000,
      duration: '20:00',
      createdAt: '2025-01-25T10:20:00',
      updatedAt: '2025-02-20T14:15:00'
    },
    {
      id: 6,
      title: 'UI/UX Design Principles',
      description: 'Thumbnail for UI/UX design course',
      type: 'image',
      category: 'Course Thumbnails',
      url: 'https://via.placeholder.com/800x450?text=UI/UX+Design+Course',
      fileSize: 280000,
      dimensions: '800x450',
      createdAt: '2025-02-18T11:10:00',
      updatedAt: '2025-03-12T13:40:00'
    },
    {
      id: 7,
      title: 'Mobile App Development',
      description: 'Promotional video for mobile development course',
      type: 'video',
      category: 'Promotional',
      url: 'https://www.youtube.com/watch?v=oykl1Ih9pMg',
      fileSize: 18000000,
      duration: '12:45',
      createdAt: '2025-01-30T14:15:00',
      updatedAt: '2025-02-25T10:20:00'
    },
    {
      id: 8,
      title: 'Study Music Playlist',
      description: 'Background music for studying',
      type: 'audio',
      category: 'Background Audio',
      url: 'https://example.com/audio/study-music.mp3',
      fileSize: 8000000,
      duration: '45:30',
      createdAt: '2025-02-12T16:30:00',
      updatedAt: '2025-03-08T12:15:00'
    }
  ];

  const mockCategories = [
    'Course Thumbnails',
    'Course Videos',
    'Promotional',
    'Background Audio',
    'Student Resources'
  ];

  useEffect(() => {
    fetchMediaItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm || filterType !== 'all' || filterCategory !== 'all') {
      filterMediaItems();
    }
  }, [searchTerm, filterType, filterCategory]);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/content/media`);
      // setMediaItems(response.data);
      
      // Using mock data for development
      setMediaItems(mockMediaItems);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch media items');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // In a real app:
      // const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/content/categories`);
      // setCategories(response.data);
      
      // Using mock data for development
      setCategories(mockCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filterMediaItems = () => {
    let filtered = [...mockMediaItems];
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    setMediaItems(filtered);
  };

  const handleAdd = () => {
    setCurrentItem({
      title: '',
      description: '',
      type: 'image',
      category: '',
      url: '',
      fileSize: 0,
      dimensions: '',
      duration: ''
    });
    setUploadedFile(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setUploadedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        // In a real app:
        // await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/content/media/${id}`);
        
        // For development:
        setMediaItems(mediaItems.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete media item');
      }
    }
  };

  const handlePreview = (item) => {
    setPreviewItem(item);
    setShowPreviewModal(true);
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Determine file type
      let type = 'image';
      if (file.type.includes('video')) {
        type = 'video';
      } else if (file.type.includes('audio')) {
        type = 'audio';
      }
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      
      setUploadedFile({
        file,
        preview: previewUrl,
        type
      });
      
      // Update current item with file info
      setCurrentItem({
        ...currentItem,
        type,
        fileSize: file.size,
        url: previewUrl // This would be replaced with the actual URL after upload
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // In a real app:
    // const formData = new FormData();
    // formData.append('file', uploadedFile.file);
    // formData.append('title', currentItem.title);
    // formData.append('description', currentItem.description);
    // formData.append('category', currentItem.category);
    // formData.append('type', currentItem.type);
    
    // try {
    //   const response = await axios.post(
    //     `${process.env.REACT_APP_API_URL}/api/admin/content/media/upload`,
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       },
    //       onUploadProgress: (progressEvent) => {
    //         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //         setUploadProgress(percentCompleted);
    //       }
    //     }
    //   );
    //   
    //   // Update current item with response data
    //   setCurrentItem({
    //     ...currentItem,
    //     url: response.data.url,
    //     id: response.data.id
    //   });
    // } catch (err) {
    //   setError('Failed to upload file');
    // }
    
    // For development, simulate a delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
    }, 3000);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      if (currentItem.id) {
        // Update existing item
        // In a real app:
        // await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/content/media/${currentItem.id}`, currentItem);
        
        // For development:
        setMediaItems(mediaItems.map(item => 
          item.id === currentItem.id ? { ...currentItem, updatedAt: new Date().toISOString() } : item
        ));
      } else {
        // Create new item
        // In a real app:
        // const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/content/media`, currentItem);
        
        // For development:
        const newItem = {
          ...currentItem,
          id: Math.max(...mediaItems.map(item => item.id)) + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setMediaItems([...mediaItems, newItem]);
      }
      
      setShowModal(false);
      setCurrentItem(null);
      setUploadedFile(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to save media item');
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMediaTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaImage />;
      case 'video':
        return <FaVideo />;
      case 'audio':
        return <FaFileAudio />;
      default:
        return <FaImage />;
    }
  };

  if (loading && mediaItems.length === 0) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Media Management</h5>
          <Button variant="primary" onClick={handleAdd}>
            <FaPlus className="me-1" /> Add Media
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by title or description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute" style={{ right: '10px', top: '10px', color: '#6c757d' }} />
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Type</Form.Label>
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Category</Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterCategory('all');
                  fetchMediaItems();
                }}
              >
                <FaFilter /> Clear
              </Button>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediaItems.length > 0 ? (
                  mediaItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <Badge bg={
                          item.type === 'image' ? 'primary' : 
                          item.type === 'video' ? 'success' : 
                          'info'
                        }>
                          {getMediaTypeIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </Badge>
                      </td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>{item.category}</td>
                      <td>{formatFileSize(item.fileSize)}</td>
                      <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handlePreview(item)}
                        >
                          <FaEye />
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleEdit(item)}
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          className="me-1"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <FaDownload />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No media items found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add/Edit Media Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentItem?.id ? 'Edit Media' : 'Add New Media'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={currentItem?.title || ''}
                    onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={currentItem?.category || ''}
                    onChange={(e) => setCurrentItem({...currentItem, category: e.target.value})}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={currentItem?.description || ''}
                onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
                required
              />
            </Form.Group>
            
            {!currentItem?.id && (
              <Form.Group className="mb-3">
                <Form.Label>Upload File</Form.Label>
                <Dropzone onDrop={handleDrop} accept={{
                  'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
                  'video/*': ['.mp4', '.webm', '.mov'],
                  'audio/*': ['.mp3', '.wav', '.ogg']
                }}>
                  {({getRootProps, getInputProps}) => (
                    <div 
                      {...getRootProps()} 
                      className="border rounded p-3 text-center"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: '#f8f9fa',
                        minHeight: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <input {...getInputProps()} />
                      {uploadedFile ? (
                        <>
                          {uploadedFile.type === 'image' && (
                            <Image 
                              src={uploadedFile.preview} 
                              alt="Preview" 
                              style={{ maxHeight: '150px', maxWidth: '100%' }} 
                              className="mb-2"
                            />
                          )}
                          {uploadedFile.type === 'video' && (
                            <div className="mb-2">
                              <FaVideo size={48} className="text-success" />
                              <p>Video file selected</p>
                            </div>
                          )}
                          {uploadedFile.type === 'audio' && (
                            <div className="mb-2">
                              <FaFileAudio size={48} className="text-info" />
                              <p>Audio file selected</p>
                            </div>
                          )}
                          <p>{uploadedFile.file.name} ({formatFileSize(uploadedFile.file.size)})</p>
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpload();
                            }}
                            disabled={isUploading}
                          >
                            {isUploading ? 'Uploading...' : 'Upload File'}
                          </Button>
                          {isUploading && (
                            <div className="w-100 mt-2">
                              <div className="progress">
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{width: `${uploadProgress}%`}}
                                  aria-valuenow={uploadProgress} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                >
                                  {uploadProgress}%
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <p>Drag and drop a file here, or click to select a file</p>
                          <p className="text-muted small">Supported formats: JPEG, PNG, GIF, MP4, WebM, MP3, WAV</p>
                        </>
                      )}
                    </div>
                  )}
                </Dropzone>
              </Form.Group>
            )}
            
            {currentItem?.id && (
              <Form.Group className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control
                  type="text"
                  value={currentItem?.url || ''}
                  onChange={(e) => setCurrentItem({...currentItem, url: e.target.value})}
                  required
                />
              </Form.Group>
            )}
            
            {currentItem?.type === 'image' && (
              <Form.Group className="mb-3">
                <Form.Label>Dimensions (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 800x600"
                  value={currentItem?.dimensions || ''}
                  onChange={(e) => setCurrentItem({...currentItem, dimensions: e.target.value})}
                />
              </Form.Group>
            )}
            
            {(currentItem?.type === 'video' || currentItem?.type === 'audio') && (
              <Form.Group className="mb-3">
                <Form.Label>Duration (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. 10:30"
                  value={currentItem?.duration || ''}
                  onChange={(e) => setCurrentItem({...currentItem, duration: e.target.value})}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={loading || (isUploading && !currentItem?.id)}
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Preview Media Modal */}
      <Modal show={showPreviewModal} onHide={() => setShowPreviewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{previewItem?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <Badge bg="secondary" className="me-2">{previewItem?.category}</Badge>
            <Badge bg={
              previewItem?.type === 'image' ? 'primary' : 
              previewItem?.type === 'video' ? 'success' : 
              'info'
            }>
              {getMediaTypeIcon(previewItem?.type)} {previewItem?.type?.charAt(0).toUpperCase() + previewItem?.type?.slice(1)}
            </Badge>
          </div>
          <p className="text-muted">{previewItem?.description}</p>
          
          <div className="my-4">
            {previewItem?.type === 'image' && (
              <Image 
                src={previewItem?.url} 
                alt={previewItem?.title} 
                fluid 
                className="shadow-sm"
              />
            )}
            {previewItem?.type === 'video' && (
              <div className="ratio ratio-16x9">
                <iframe 
                  src={previewItem?.url.includes('youtube.com') ? 
                    previewItem?.url.replace('watch?v=', 'embed/') : 
                    previewItem?.url
                  } 
                  title={previewItem?.title} 
                  allowFullScreen
                ></iframe>
              </div>
            )}
            {previewItem?.type === 'audio' && (
              <div className="p-4 border rounded bg-light">
                <audio controls className="w-100">
                  <source src={previewItem?.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
          
          <div className="d-flex justify-content-between mt-3">
            <div>
              <strong>File Size:</strong> {formatFileSize(previewItem?.fileSize)}
            </div>
            {previewItem?.dimensions && (
              <div>
                <strong>Dimensions:</strong> {previewItem?.dimensions}
              </div>
            )}
            {previewItem?.duration && (
              <div>
                <strong>Duration:</strong> {previewItem?.duration}
              </div>
            )}
            <div>
              <strong>Last Updated:</strong> {previewItem?.updatedAt && new Date(previewItem.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowPreviewModal(false);
              handleEdit(previewItem);
            }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MediaManager;
