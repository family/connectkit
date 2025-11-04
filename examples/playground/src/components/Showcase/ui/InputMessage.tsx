import { AnimatePresence } from 'framer-motion'
import { MDiv } from '@/components/motion/motion'
import { cn } from '@/lib/cn'

export const InputMessage = ({
  message,
  show,
  className,
  variant,
}: {
  message: string
  show: boolean
  className?: string
  variant: 'success' | 'error' | 'default'
}) => {
  return (
    <AnimatePresence>
      {show && (
        <MDiv
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          key={message}
          className="overflow-hidden"
        >
          <div className="mt-1">
            <span
              className={cn(
                'text-sm whitespace-normal break-words',
                variant === 'success' && 'text-success',
                variant === 'error' && 'text-error',
                variant === 'default' && 'text-muted-foreground',
                className
              )}
            >
              {message}
            </span>
          </div>
        </MDiv>
      )}
    </AnimatePresence>
  )
}
