import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));

    return (
      <div
        ref={ref}
        className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
        {...props}
      >
        {/* Glow layer beneath the fill */}
        <div
          className="absolute bottom-0 left-0 h-1 blur-sm opacity-40 transition-all duration-500"
          style={{
            width: `${clamped}%`,
            background: '#34d399',
          }}
        />
        {/* Gradient fill with shimmer */}
        <motion.div
          className="h-full rounded-full progress-shimmer"
          style={{
            background: 'linear-gradient(to right, #facc15, #22d3ee, #34d399)',
          }}
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
