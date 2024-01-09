import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/utils/css/css';

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        green: 'border-green-600 bg-green-500/20 text-green-600',
        red: 'border-red-600 text-red-600 bg-red-500/20',
        amber: 'border-amber-600 text-amber-600 bg-amber-500/20'
      },
      size: {
        sm: 'font-normal text-xs',
        default: 'text-xs font-semibold'
      },
      rounding: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        full: 'rounded-full'
      }
    },
    defaultVariants: {
      size: 'default',
      rounding: 'full',
      variant: 'default'
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
}

function Badge({ className, variant, size, rounding, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, rounding }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
