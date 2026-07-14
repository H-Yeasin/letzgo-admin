import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'bottom-border';
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

export default function Input({
  variant = 'bottom-border',
  icon,
  className = '',
  wrapperClassName = '',
  ...props
}: InputProps) {
  const inputClasses = [
    variant === 'bottom-border' ? 'search-input' : 'form-input',
    'defi-input',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (icon) {
    return (
      <div className={`input-wrapper ${wrapperClassName}`} style={{ position: 'relative' }}>
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-fg-dim)',
            display: 'flex',
            pointerEvents: 'none',
          }}
        >
          {icon}
        </span>
        <input
          className={inputClasses}
          style={{ paddingLeft: 40 }}
          {...props}
        />
      </div>
    );
  }

  return <input className={inputClasses} {...props} />;
}
