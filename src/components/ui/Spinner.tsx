import React from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function Spinner({
  size = 24,
  color,
  className = '',
}: SpinnerProps) {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: size,
        height: size,
        borderColor: 'var(--color-border)',
        borderTopColor: color || 'var(--color-primary)',
      }}
    />
  );
}
