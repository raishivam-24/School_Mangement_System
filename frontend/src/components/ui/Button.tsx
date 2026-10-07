/**
 * @file Button.tsx
 * @description Production button component using class-variance-authority (CVA)
 * for type-safe variant styling. All colors reference CSS design tokens.
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  /* Base styles */
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-blue text-white hover:brightness-110 shadow-sm hover:shadow-md active:scale-[0.98]',
        secondary:
          'bg-surface text-primary border border-border hover:bg-surface-raised hover:border-border-dark active:scale-[0.98]',
        ghost:
          'text-secondary hover:text-primary hover:bg-surface-raised',
        danger:
          'bg-accent-rose text-white hover:brightness-110 shadow-sm active:scale-[0.98]',
        success:
          'bg-accent-green text-white hover:brightness-110 shadow-sm active:scale-[0.98]',
        outline:
          'border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-lg',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
