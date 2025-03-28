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

// Admin Route
const Sidebar = React.lazy(() => import('./pages/admin/AdminSidebar/sidebar.jsx'));
const AdminLogin = React.lazy(() => import('./pages/admin/Login/AdminLogin'));
const AdminHome = React.lazy(() => import('./pages/admin/Home.jsx'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard.jsx'));
const Students = React.lazy(() => import('./pages/admin/Students'));
const Courses = React.lazy(() => import('./pages/admin/Courses'));
const Instructors = React.lazy(() => import('./pages/admin/Instructors'));
const Categories = React.lazy(() => import('./pages/admin/Categories'));
const Reports = React.lazy(() => import('./pages/admin/Reports'));
const Settings = React.lazy(() => import('./pages/admin/Settings'));
const CreateEmployee = React.lazy(() => import('./pages/admin/Employee/CreateEmployee'));
const ManageEmployees = React.lazy(()=> import('./pages/admin/Employee/ManageEmployees.jsx'))
const ViewEmployees = React.lazy(()=> import('./pages/admin/Employee/ViewEmployees.jsx'))
const CreateJobRole = React.lazy(() => import('./pages/admin/Employee/CreateJobRole'));
const ManageJobRoles = React.lazy(() => import('./pages/admin/Employee/ManageJobRoles'));
const ViewJobRoles = React.lazy(() => import('./pages/admin/Employee/ViewJobRoles'));
const GuestTeachers = React.lazy(() => import('./pages/admin/GuestTeachers'));
const CourseList = React.lazy(() => import('./pages/admin/CourseManagement/CourseList'));
const CourseForm = React.lazy(() => import('./pages/admin/CourseManagement/CourseForm'));
const AssessmentList = React.lazy(() => import('./pages/admin/AssessmentCenter/AssessmentList'));
const CreateAssessment = React.lazy(() => import('./pages/admin/AssessmentCenter/CreateAssessment'));
const AssessmentDetails = React.lazy(() => import('./pages/admin/AssessmentCenter/AssessmentDetails'));
const AssessmentResults = React.lazy(() => import('./pages/admin/AssessmentCenter/AssessmentResults'));
const AnalyticsDashboard = React.lazy(() => import('./pages/admin/Analytics/AnalyticsDashboard'));
const ContentDashboard = React.lazy(() => import('./pages/admin/ContentManagement/ContentDashboard'));
const SupportDashboard = React.lazy(() => import('./pages/admin/StudentSupport/SupportDashboard'));
const PaymentDashboard = React.lazy(() => import('./pages/admin/PaymentManagement/PaymentDashboard'));
const PaymentHistory = React.lazy(() => import('./pages/admin/PaymentManagement/components/PaymentHistory'));
const RefundManagement = React.lazy(() => import('./pages/admin/PaymentManagement/components/RefundManagement'));
const PaymentSettings = React.lazy(() => import('./pages/admin/PaymentManagement/components/PaymentSettings'));

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
const GetStarted = React.lazy(() => import('./pages/HireFromUs/GetStarted.jsx'));
const OurStudent = React.lazy(() => import('./pages/HireFromUs/OurStudents.jsx'));
const Review = React.lazy(() => import('./pages/Review/Review'));
const CoursesPage = React.lazy(() => import('./pages/Courses/Courses'));
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
      <Route path='/get-started' element={<GetStarted />} />
      <Route path='/our-student' element={<OurStudent />} />
      <Route path="/review" element={<Review />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/generative-ai" element={<GenerativeAI />} />
      <Route path="/generative-ai-card" element={<GenerativeAIcard />} />
      <Route path="/generative-ai-details" element={<GenerativeAipagedetails />} />

      {/* Admin Route */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<AdminHome />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="courses" element={<Courses />} />
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
      <Suspense
        fallback={
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        }
      >
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