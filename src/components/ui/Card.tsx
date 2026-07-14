import React from 'react';

interface CardProps {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const paddingMap: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const variantStyles: Record<string, string> = {
  default: '',  // uses card-default styles
  elevated: '', // uses card-elevated styles
  glass: '',    // uses card-glass styles
  interactive: '',
};

export default function Card({
  variant = 'default',
  hover = false,
  padding = 'md',
  children,
  className = '',
}: CardProps) {
  const paddingClass = `p-${padding === 'sm' ? 4 : padding === 'md' ? 6 : 8}`;
  const classes = [
    'card',
    variant !== 'default' ? `card-${variant}` : '',
    hover ? 'card-hover' : '',
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Map padding values to actual CSS classes defined in global.css
  const paddingStyles: Record<string, string> = {
    sm: 'var(--space-4)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)',
  };

  return (
    <div
      className={classes}
      style={{ padding: paddingStyles[padding] }}
    >
      {children}
    </div>
  );
}
