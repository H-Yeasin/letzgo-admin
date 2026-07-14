import React from 'react';

interface GlowTextProps {
  variant?: 'gold' | 'orange' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
}

const sizeMap: Record<string, string> = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem',
};

const fontFamilyMap: Record<string, string> = {
  h1: 'var(--font-heading)',
  h2: 'var(--font-heading)',
  h3: 'var(--font-heading)',
  h4: 'var(--font-heading)',
  span: 'var(--font-body)',
  p: 'var(--font-body)',
};

export default function GlowText({
  variant = 'gold',
  size = 'md',
  children,
  className = '',
  as: Tag = 'span',
}: GlowTextProps) {
  const glowClass = variant === 'gold' ? 'glow-text' : variant === 'orange' ? 'glow-text-orange' : '';
  const fontSize = sizeMap[size];
  const fontFamily = fontFamilyMap[Tag];

  return (
    <Tag
      className={`${glowClass} ${className}`}
      style={{ fontSize, fontFamily, fontWeight: 600 }}
    >
      {children}
    </Tag>
  );
}
