import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Dashboard/Sidebar';
import { DashboardOverview } from '../components/Dashboard/DashboardOverview';

export function Dashboard() {
  const location = useLocation();
  const isDashboardRoot = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        
        <div className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isDashboardRoot ? <DashboardOverview /> : <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}