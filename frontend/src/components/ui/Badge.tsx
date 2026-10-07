/**
 * @file Badge.tsx
 * @description Semantic badge/pill component with theme-aware variant colors.
 */

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-surface-raised text-secondary border border-border',
        blue: 'bg-accent-blue-subtle text-accent-blue',
        green: 'bg-accent-green-subtle text-accent-green',
        amber: 'bg-accent-amber-subtle text-accent-amber',
        rose: 'bg-accent-rose-subtle text-accent-rose',
        violet: 'bg-accent-violet-subtle text-accent-violet',
        teal: 'bg-accent-teal-subtle text-accent-teal',
        solid: 'bg-accent-blue text-white',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { badgeVariants };
