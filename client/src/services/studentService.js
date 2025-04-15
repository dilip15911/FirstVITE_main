import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Fetch all students (with optional search query)
export const fetchStudents = async (search = '', token) => {
  return axios.get(`${API_URL}/students?search=${encodeURIComponent(search)}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
};

// Add a new student
export const addStudent = async (studentData, token) => {
  return axios.post(`${API_URL}/students`, studentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Example usage in your component:
// import { fetchStudents, addStudent } from '../../services/studentService';
//
// useEffect(() => {
//   const token = localStorage.getItem('token');
//   fetchStudents('', token)
//     .then(res => setStudents(res.data))
//     .catch(err => {
//       if (err.response && err.response.status === 401) {
//         alert('Session expired. Please log in again.');
//       }
//     });
// }, []);
