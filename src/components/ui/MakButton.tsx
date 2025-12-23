import * as React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { cn } from '@/lib/utils';

type ButtonVariant = 'contained' | 'outlined' | 'text' | 'secondary' | 'ghost' | 'link' | 'destructive';
type ButtonSize = 'small' | 'medium' | 'large' | 'icon';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses = {
  contained: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outlined: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  text: '',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

const sizeClasses = {
  small: 'h-9 px-3 text-sm',
  medium: 'h-10 px-4 py-2',
  large: 'h-11 px-8',
  icon: 'h-10 w-10 min-w-10 p-0',
};

const MakButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'contained',
    size = 'medium',
    disabled,
    isLoading,
    children,
    ...props
  }, ref) => {
    const buttonVariant = variant === 'ghost' || variant === 'link' || variant === 'destructive' 
      ? 'text' 
      : variant === 'secondary' 
        ? 'contained' 
        : variant;

    return (
      <MuiButton
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant] || '',
          sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium,
          className
        )}
        variant={buttonVariant as MuiButtonProps['variant']}
        size={size === 'icon' ? 'small' : size as MuiButtonProps['size']}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </MuiButton>
    );
  }
);

MakButton.displayName = 'Button';

export { MakButton };
