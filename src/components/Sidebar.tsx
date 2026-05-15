import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/users', label: 'Users', icon: '👥' },
    { path: '/rides/active', label: 'Active Rides', icon: '🚗' },
    { path: '/rides/completed', label: 'Completed Rides', icon: '✅' },
    { path: '/reports', label: 'Reports', icon: '⚠️' },
    { path: '/disputes', label: 'Disputes', icon: '⚖️' },
    { path: '/meetup-reports', label: 'Meetup Reports', icon: '📍' },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1>LetzGo Admin</h1>
                <p>Management Dashboard</p>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}