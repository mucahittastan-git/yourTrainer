import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-page text-main transition-colors duration-500 overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-20">
          <div 
            key={location.pathname} 
            className="animate-fade-in"
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
