import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<string, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  default: 'badge-gray',
};

export default function Badge({
  variant = 'default',
  pulse = false,
  children,
  className = '',
}: BadgeProps) {
  const classes = ['badge', variantMap[variant], className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {pulse && <span className="ping" style={{ width: 6, height: 6, display: 'inline-block', marginRight: 6 }} />}
      {children}
    </span>
  );
}
