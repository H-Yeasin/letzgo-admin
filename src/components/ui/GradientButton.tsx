import React from 'react';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({
  children,
  loading = false,
  size = 'md',
  disabled,
  className = '',
  ...props
}: GradientButtonProps) {
  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.375rem 1.25rem', fontSize: '0.75rem', minHeight: 36 },
    md: { padding: '0.625rem 2rem', fontSize: '0.875rem', minHeight: 44 },
    lg: { padding: '0.75rem 2.5rem', fontSize: '1rem', minHeight: 52 },
  };

  return (
    <button
      className={`gradient-btn ${className}`}
      disabled={disabled || loading}
      style={{
        background: 'linear-gradient(to right, #EA580C, #F7931A)',
        color: '#fff',
        border: 'none',
        borderRadius: 9999,
        fontWeight: 600,
        fontFamily: 'var(--font-body)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 250ms ease',
        boxShadow: '0 0 20px rgba(247, 147, 26, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        opacity: disabled || loading ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        ...sizeStyles[size],
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 0 30px rgba(247, 147, 26, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(247, 147, 26, 0.25)';
      }}
      {...props}
    >
      {loading && (
        <span
          className="spinner"
          style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}
        />
      )}
      {children}
    </button>
  );
}
