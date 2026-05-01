import * as React from 'react';
import { cn } from '@/lib/utils';

const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('relative w-full overflow-auto overscroll-contain', className)} {...props} />
  )
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
