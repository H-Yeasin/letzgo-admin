import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

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
                        <span className="admin-badge">Admin</span>
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>
                    </div>
                </div>
                <Outlet />
            </main>
        </div>
    );
}