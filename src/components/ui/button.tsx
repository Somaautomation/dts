import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-0.5 hover:scale-[1.02] before:absolute before:inset-0 before:-translate-x-[125%] before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.32),transparent)] before:transition-transform before:duration-700 hover:before:translate-x-[125%] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-300 after:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_56%)] hover:after:opacity-100 hover:shadow-[0_14px_28px_-14px_rgba(0,51,102,0.6)] [&>svg]:transition-transform [&>svg]:duration-300 group-hover:[&>svg]:translate-x-0.5 group-hover:[&>svg]:scale-110 group-hover:[&>svg]:-rotate-6',
  {
    variants: {
      variant: {
        default: 'bg-brand-blue text-white hover:bg-brand-blue-dark shadow-sm hover:shadow-lg',
        primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark shadow-md hover:shadow-xl',
        secondary: 'bg-brand-green text-white hover:bg-brand-green-dark shadow-sm hover:shadow-lg',
        accent: 'bg-brand-saffron text-brand-blue hover:bg-brand-saffron-dark shadow-md hover:shadow-xl',
        outline: 'border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white hover:shadow-lg',
        ghost: 'hover:bg-brand-gray text-brand-blue',
        link: 'text-brand-blue underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 hover:shadow-lg',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
