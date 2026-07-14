import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    size !== 'md' ? `btn-${size}` : '',
    variant !== 'primary' ? `btn-${variant}` : 'btn-primary',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
    </button>
  );
}
