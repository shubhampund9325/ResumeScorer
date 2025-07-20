// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import '../components/NavBar.css'; // Assuming you have some styles for the Navbar
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;