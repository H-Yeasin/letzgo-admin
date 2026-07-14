import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export default function GlassCard({
  children,
  className = '',
  padding,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: 'rgba(15, 17, 21, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-2xl)',
        padding: padding || 'var(--space-10, 2.5rem)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </div>
  );
}
