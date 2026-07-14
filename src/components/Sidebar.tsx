import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Car,
  CheckCircle2,
  AlertTriangle,
  Scale,
  MapPin,
  LucideIcon,
} from 'lucide-react';

const navItems: { path: string; label: string; icon: LucideIcon }[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'Users', icon: Users },
  { path: '/rides/active', label: 'Active Rides', icon: Car },
  { path: '/rides/completed', label: 'Completed Rides', icon: CheckCircle2 },
  { path: '/reports', label: 'Reports', icon: AlertTriangle },
  { path: '/disputes', label: 'Disputes', icon: Scale },
  { path: '/meetup-reports', label: 'Meetup Reports', icon: MapPin },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>LetzGo</h1>
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
            <span className="nav-icon">
              <item.icon size={18} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
