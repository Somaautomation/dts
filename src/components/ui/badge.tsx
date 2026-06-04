import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-brand-gray text-brand-blue',
  primary: 'bg-brand-blue text-white',
  success: 'bg-brand-green/10 text-brand-green border border-brand-green/30',
  warning: 'bg-brand-saffron/10 text-brand-saffron-dark border border-brand-saffron/40',
  danger: 'bg-red-50 text-red-700 border border-red-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
} as const;

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}
