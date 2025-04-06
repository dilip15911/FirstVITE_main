import React, { Suspense } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import RootLayout from './layouts/RootLayout';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './styles/adminTheme.css';
import Home from './pages/Home';
import Courses from './pages/Courses/Courses.jsx';
import CourseDetails from './pages/Courses/CourseDetails.jsx';

// Admin Route
const AdminLogin = React.lazy(() => import('./pages/admin/Login/AdminLogin.jsx'));
const AdminHome = React.lazy(() => import('./pages/admin/Home.jsx'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard.jsx'));
const TestAuth = React.lazy(() => import('./pages/admin/TestAuth.jsx'));
const Students = React.lazy(() => import('./pages/admin/Students.jsx'));
const CoursesAdmin = React.lazy(() => import('./pages/admin/Courses.jsx'));
const Instructors = React.lazy(() => import('./pages/admin/Instructors.jsx'));
const Categories = React.lazy(() => import('./pages/admin/Categories.jsx'));
const Reports = React.lazy(() => import('./pages/admin/Reports.jsx'));
const Settings = React.lazy(() => import('./pages/admin/Settings.jsx'));
const CreateEmployee = React.lazy(() => import('./pages/admin/Employee/CreateEmployee.jsx'));
const ManageEmployees = React.lazy(()=> import('./pages/admin/Employee/ManageEmployees.jsx'))
const ViewEmployees = React.lazy(()=> import('./pages/admin/Employee/ViewEmployees.jsx'))
const CreateJobRole = React.lazy(() => import('./pages/admin/Employee/CreateJobRole.jsx'));
const ManageJobRoles = React.lazy(() => import('./pages/admin/Employee/ManageJobRoles.jsx'));
const ViewJobRoles = React.lazy(() => import('./pages/admin/Employee/ViewJobRoles.jsx'));
const GuestTeachers = React.lazy(() => import('./pages/admin/GuestTeachers.jsx'));
const CourseList = React.lazy(() => import('./pages/admin/CourseManagement/CourseList.jsx'));
const CourseForm = React.lazy(() => import('./pages/admin/CourseManagement/CourseForm.jsx'));
const AssessmentList = React.lazy(() => import('./pages/admin/AssessmentCenter/AssessmentList.jsx'));
const CreateAssessment = React.lazy(() => import('./pages/admin/AssessmentCenter/CreateAssessment.jsx'));
const AssessmentDetails = React.lazy(() => import('./pages/admin/AssessmentCenter/AssessmentDetails.jsx'));
const AssessmentResults = React.lazy(() => import('./pages/admin/AssessmentCenter/AssessmentResults.jsx'));
const AnalyticsDashboard = React.lazy(() => import('./pages/admin/Analytics/AnalyticsDashboard.jsx'));
const ContentDashboard = React.lazy(() => import('./pages/admin/ContentManagement/ContentDashboard.jsx'));
const SupportDashboard = React.lazy(() => import('./pages/admin/StudentSupport/SupportDashboard.jsx'));
const PaymentDashboard = React.lazy(() => import('./pages/admin/PaymentManagement/PaymentDashboard.jsx'));
const PaymentHistory = React.lazy(() => import('./pages/admin/PaymentManagement/components/PaymentHistory.jsx'));
const RefundManagement = React.lazy(() => import('./pages/admin/PaymentManagement/components/RefundManagement.jsx'));
const PaymentSettings = React.lazy(() => import('./pages/admin/PaymentManagement/components/PaymentSettings.jsx'));

// Lazy load components
const Login = React.lazy(() => import('./pages/auth/Login.jsx'));
const Signup = React.lazy(() => import('./pages/auth/Signup.jsx'));
const VerifyOTP = React.lazy(() => import('./pages/auth/VerifyOTP.jsx'));
const Profile = React.lazy(() => import('./pages/user/Profile.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard.jsx'));
const SendEmail = React.lazy(() => import('./pages/SendEmail.jsx'));
const Corporate = React.lazy(() => import('./pages/Corporate/Corporate.jsx'));
const Blog = React.lazy(() => import('./pages/blog/blog.jsx'));
const Tutorials = React.lazy(() => import('./pages/Tutorials/Tutorials.jsx'));
const Documentation = React.lazy(() => import('./pages/Documentation/Documentation.jsx'));
const BecomeATeacher = React.lazy(() => import('./pages/BecomeATeacher/BecomeATeacher.jsx'));
const Contact = React.lazy(() => import('./pages/Contact/Contact.jsx'));
const HireFromUs = React.lazy(() => import('./pages/HireFromUs/HireFromUs.jsx'));
const GetStarted = React.lazy(() => import('./pages/HireFromUs/GetStarted.jsx'));
const OurStudent = React.lazy(() => import('./pages/HireFromUs/OurStudents.jsx'));
const Review = React.lazy(() => import('./pages/Review/Review.jsx'));
const GenerativeAI = React.lazy(() => import('./pages/GenerativeAI/GenerativeAipage.jsx'));
const GenerativeAIcard = React.lazy(() => import('./pages/GenerativeAI/GenerativeAIcard.jsx'));
const GenerativeAipagedetails = React.lazy(() => import('./pages/GenerativeAI/GenerativeAipagedetails.jsx'));

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
      <Route path='/get-started' element={<GetStarted />} />
      <Route path='/our-student' element={<OurStudent />} />
      <Route path="/review" element={<Review />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/generative-ai" element={<GenerativeAI />} />
      <Route path="/generative-ai-card" element={<GenerativeAIcard />} />
      <Route path="/generative-ai-details" element={<GenerativeAipagedetails />} />

      {/* Admin Route */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/test-auth" element={<TestAuth />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="courses" element={<CoursesAdmin />} />
        <Route path="instructors" element={<Instructors />} />
        <Route path="categories" element={<Categories />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="guest-teachers" element={<GuestTeachers />} />
        
        {/* Course Management */}
        <Route path="course-management">
          <Route index element={<Navigate to="list" replace />} />
          <Route path="list" element={<CourseList />} />
          <Route path="create" element={<CourseForm />} />
          <Route path="edit/:id" element={<CourseForm />} />
        </Route>
        
        {/* Assessment Center */}
        <Route path="assessments">
          <Route index element={<AssessmentList />} />
          <Route path="create" element={<CreateAssessment />} />
          <Route path=":id" element={<AssessmentDetails />} />
          <Route path=":id/edit" element={<CreateAssessment />} />
          <Route path="results" element={<AssessmentResults />} />
        </Route>
        
        {/* Analytics */}
        <Route path="analytics" element={<AnalyticsDashboard />} />
        
        {/* Content Management */}
        <Route path="content" element={<ContentDashboard />} />
        
        {/* Student Support */}
        <Route path="support" element={<SupportDashboard />} />
        
        {/* Payment Management */}
        <Route path="payments">
          <Route index element={<PaymentDashboard />} />
          <Route path="history" element={<PaymentHistory />} />
          <Route path="refunds" element={<RefundManagement />} />
          <Route path="settings" element={<PaymentSettings />} />
        </Route>
        
        <Route path="employee">
          <Route index element={<Navigate to="create-employee" replace />} />
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="manage-employee" element={<ManageEmployees />} />
          <Route path="view-employee" element={<ViewEmployees />} />
          <Route path="create-jobrole" element={<CreateJobRole />} />
          <Route path="manage-jobrole" element={<ManageJobRoles />} />
          <Route path="view-jobrole" element={<ViewJobRoles />} />
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          closeButton={false}
        />
      </Suspense>
    </AuthProvider>
  );
}

export default App;