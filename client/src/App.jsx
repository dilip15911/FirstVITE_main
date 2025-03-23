import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import RootLayout from './layouts/RootLayout';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './pages/Home';



// Admin Route
const Admin = React.lazy(() => import('./pages/admin/Home.jsx'));
const Sidebar = React.lazy(() => import('./components/Admin/Sidebar/Sidebar'));
const AdminNavbar = React.lazy(()=> import('./components/Admin/Navbar/Navbar.jsx'))




// Lazy load components
const Login = React.lazy(() => import('./pages/auth/Login'));
const Signup = React.lazy(() => import('./pages/auth/Signup'));
const VerifyOTP = React.lazy(() => import('./pages/auth/VerifyOTP'));
const Profile = React.lazy(() => import('./pages/user/Profile'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'));
const SendEmail = React.lazy(() => import('./pages/SendEmail.jsx'));
const Corporate = React.lazy(() => import('./pages/Corporate/Corporate'));
const Blog = React.lazy(() => import('./pages/blog/blog'));
const Tutorials = React.lazy(() => import('./pages/Tutorials/Tutorials'));
const Documentation = React.lazy(() => import('./pages/Documentation/Documentation'));
const BecomeATeacher = React.lazy(() => import('./pages/BecomeATeacher/BecomeATeacher'));
const Contact = React.lazy(() => import('./pages/Contact/Contact'));
const HireFromUs = React.lazy(() => import('./pages/HireFromUs/HireFromUs'));
const GetStarted = React.lazy(()=> import('./pages/HireFromUs/GetStarted.jsx'));
const OurStudent = React.lazy(()=> import('./pages/HireFromUs/OurStudents.jsx'));
const Review = React.lazy(() => import('./pages/Review/Review'));
const Courses = React.lazy(() => import('./pages/Courses/Courses'));
const GenerativeAI = React.lazy(() => import('./pages/GenerativeAI/GenerativeAipage'));
const GenerativeAIcard = React.lazy(() => import('./pages/GenerativeAI/GenerativeAIcard'));
const GenerativeAipagedetails = React.lazy(() => import('./pages/GenerativeAI/GenerativeAipagedetails'));




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/send-email" element={<SendEmail />} />
      <Route path="/corporate" element={<Corporate />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/tutorials" element={<Tutorials />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/become-a-teacher" element={<BecomeATeacher />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/hire-from-us" element={<HireFromUs />} />
      <Route path='/get-started' element={<GetStarted/>}/>
      <Route path='/our-student' element={<OurStudent/>}/>
      <Route path="/review" element={<Review />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/generative-ai" element={<GenerativeAI />} />
      <Route path="/generative-ai-card" element={<GenerativeAIcard />} />
      <Route path="/generative-ai-details" element={<GenerativeAipagedetails />} />
      


      {/* Admin Route */}
      <Route path="/admin" element={<PrivateRoute><Admin /> <Sidebar /> <AdminNavbar /></PrivateRoute>} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      }>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Suspense>

    </AuthProvider>
  );
}

export default App;