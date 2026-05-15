import React, { useEffect, useState } from 'react';
import { getDashboardStats, AdminStats } from '../api/admin';

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
        return <div className="loading"><div className="spinner" /></div>;
    }

    if (!stats) {
        return <div className="empty-state">Failed to load dashboard stats</div>;
    }

    return (
        <div>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Users</div>
                    <div className="stat-value">{stats.total_users}</div>
                    <div className="stat-sub">Registered users</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active Rides</div>
                    <div className="stat-value">{stats.active_rides}</div>
                    <div className="stat-sub">Currently active</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Completed Rides</div>
                    <div className="stat-value">{stats.completed_rides}</div>
                    <div className="stat-sub">All time</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Pending Reports</div>
                    <div className="stat-value">{stats.pending_reports}</div>
                    <div className="stat-sub">Awaiting review</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Open Disputes</div>
                    <div className="stat-value">{stats.open_disputes}</div>
                    <div className="stat-sub">Needs resolution</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Cancellation Rate</div>
                    <div className="stat-value">{stats.cancellation_rate}%</div>
                    <div className="stat-sub">Of all rides</div>
                </div>
            </div>
        </div>
    );
}