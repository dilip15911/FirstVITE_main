import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const RootLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content" style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
