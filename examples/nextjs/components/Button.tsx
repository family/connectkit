import React from 'react';

interface ButtonProps {
  variant?: 'ghost' | 'solid' | 'outline'; // Add other variants as needed
  size?: 'sm' | 'md' | 'lg' | 'icon'; // Add other sizes as needed
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ className, variant = "solid", size = "sm", children, onClick, disabled }) => {
  let buttonClasses = 'transition-all duration-300 inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';

  if (disabled) {
    buttonClasses += ' opacity-50 cursor-not-allowed';
  }

  // Variant styles
  if (variant === 'ghost') {
    buttonClasses += ' bg-transparent text-primary hover:bg-primary/10';
  } else if (variant === 'solid') {
    buttonClasses += ' bg-primary text-white hover:bg-primaryHover';
  } else if (variant === 'outline') {
    buttonClasses += ' border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground';
  }

  // Size styles
  if (size === 'icon') {
    buttonClasses += ' p-2'; // Small padding for icon buttons
  } else if (size === 'sm') {
    buttonClasses += ' px-3 py-2 text-sm';
  } else if (size === 'md') {
    buttonClasses += ' px-4 py-2 text-base';
  } else if (size === 'lg') {
    buttonClasses += ' px-6 py-3 text-lg';
  }

  return (
    <button className={className + " " + buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
