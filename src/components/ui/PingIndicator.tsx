import React from 'react';

interface PingIndicatorProps {
  color?: string;
  size?: number;
  className?: string;
}

export default function PingIndicator({
  color,
  size = 8,
  className = '',
}: PingIndicatorProps) {
  return (
    <span
      className={`ping-indicator ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color || 'var(--color-primary)',
        }}
      />
      <span
        className="ping-ring"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${color || 'var(--color-primary)'}`,
          opacity: 0.4,
          animation: 'ping 1.5s ease-in-out infinite',
        }}
      />
    </span>
  );
}
