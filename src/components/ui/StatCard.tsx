import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  sub,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="stat-card fade-in-up">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {(sub || trend) && (
        <div className="stat-sub">
          {trend && (
            <span
              style={{
                color: trend === 'up' ? 'var(--color-success)' : 'var(--color-danger)',
                marginRight: 4,
              }}
            >
              {trend === 'up' ? '↑' : '↓'} {trendValue}
              {' '}
            </span>
          )}
          {sub}
        </div>
      )}
    </div>
  );
}
