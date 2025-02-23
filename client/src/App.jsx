import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Program from './pages/Programs/AllPrograms';
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import AdminRoutes from './components/AdminRoutes/AdminRoutes';
import { SignIn, SignUp, SignInPage, SignUpPage } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";



// Lazy load pages for better performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Login = React.lazy(() => import('./pages/Login/Login'));
const Signup = React.lazy(() => import('./pages/Signup/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/Login/ForgotPassword'));
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/Users'));
const Corporate = React.lazy(() => import("./pages/Corporate/Corporate"));

// Load admin components
const AdminLayout = React.lazy(() => import('./components/AdminLayout/AdminLayout'));
const ProtectedRoute = React.lazy(() => import('./components/ProtectedRoute/ProtectedRoute'));
// const SignIn = React.lazy(() => import('@clerk/clerk-react/dist/SignIn'));
// const SignUp = React.lazy(() => import('@clerk/clerk-react/dist/SignUp'));
// const SignInPage = React.lazy(() => import('@clerk/clerk-react/dist/SignInPage'));
// const SignUpPage = React.lazy(() => import('@clerk/clerk-react/dist/SignUpPage'));


console.log("App is starting...");





function AuthPage() {
  return (
    <div>
      <h1>Sign In</h1>
      <SignIn />
      <h1>Sign Up</h1>
      <SignUp />
    </div>
  );
}





// const AdminRoutes = () => (
//   <Suspense fallback={<LoadingSpinner />}>
//     <ProtectedRoute>
//       <AdminLayout />
//     </ProtectedRoute>
//   </Suspense>
// );

// Layout component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const noHeaderFooterRoutes = ['/login', '/signup', '/admin/login', '/forgot-password'];
  const shouldShowHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowHeaderFooter && <Navbar />}
      {children}
      {shouldShowHeaderFooter && <Footer />}
    </>
  );
};

function App() {
  return (


    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Layout>
                <main className="main-content">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/program" element={<Program />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* Corprarte */}
                      <Route path="/corporate-traning" element={<Corporate />} />

                      {/* Admin Routes */}
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/admin" element={<AdminRoutes />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="users" element={<AdminUsers />} />
                      </Route>

                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
              </Layout>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
