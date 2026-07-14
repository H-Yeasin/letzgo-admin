import React, { useEffect, useState } from 'react';
import { getDashboardStats, AdminStats } from '../api/admin';
import {
  Users,
  Car,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Percent,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Skeleton from '../components/ui/Skeleton';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="stat-card" style={{ padding: 'var(--space-6)' }}>
            <Skeleton width="40px" height="40px" borderRadius="var(--radius-md)" />
            <div style={{ marginTop: 16 }}>
              <Skeleton width="60%" height="12px" />
            </div>
            <div style={{ marginTop: 8 }}>
              <Skeleton width="80%" height="28px" />
            </div>
            <div style={{ marginTop: 4 }}>
              <Skeleton width="40%" height="10px" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="empty-state">
        <AlertTriangle size={32} style={{ marginBottom: 8, color: 'var(--color-fg-dim)' }} />
        <p>Failed to load dashboard stats</p>
      </div>
    );
  }

  const statItems = [
    { icon: <Users size={24} />, label: 'Total Users', value: stats.total_users, sub: 'Registered users' },
    { icon: <Car size={24} />, label: 'Active Rides', value: stats.active_rides, sub: 'Currently active' },
    { icon: <CheckCircle2 size={24} />, label: 'Completed Rides', value: stats.completed_rides, sub: 'All time' },
    { icon: <AlertTriangle size={24} />, label: 'Pending Reports', value: stats.pending_reports, sub: 'Awaiting review' },
    { icon: <Scale size={24} />, label: 'Open Disputes', value: stats.open_disputes, sub: 'Needs resolution' },
    { icon: <Percent size={24} />, label: 'Cancellation Rate', value: `${stats.cancellation_rate}%`, sub: 'Of all rides' },
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, i) => (
        <div
          key={item.label}
          className="stat-card fade-in-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <StatCard
            icon={item.icon}
            label={item.label}
            value={item.value}
            sub={item.sub}
          />
        </div>
      ))}
    </div>
  );
}
