import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import Badge from './ui/Badge';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'Users Management',
  '/rides/active': 'Active Rides',
  '/rides/completed': 'Completed Rides',
  '/reports': 'User Reports',
  '/disputes': 'Disputes',
  '/meetup-reports': 'Unsafe Meetup Reports',
};

export default function Layout() {
  const { logout } = useAuth();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Admin Panel';

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          <h2>{title}</h2>
          <div className="topbar-right">
            <Badge variant="info">Admin</Badge>
            <button className="logout-btn" onClick={logout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
