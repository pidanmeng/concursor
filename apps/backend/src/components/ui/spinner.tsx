"use client"

import { cn } from '@/lib/utils'

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  const sizeClass = 
    size === 'sm' ? 'h-4 w-4' :
    size === 'lg' ? 'h-8 w-8' :
    'h-6 w-6'

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClass,
        className
      )}
      {...props}
    >
      <span className="sr-only">加载中...</span>
    </div>
  )
} 