import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from 'react-router-dom';

const RootLayout = () => {
  const location = useLocation();
  // Hide Navbar & Footer on these paths
  const hideNavbarFooter = ["/login", "/signup", "/verify-otp"].includes(location.pathname);

  return (
    <div className="app">
      {!hideNavbarFooter && <Navbar />}
      <main className="main-content">
        <Outlet />
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

export default RootLayout;
