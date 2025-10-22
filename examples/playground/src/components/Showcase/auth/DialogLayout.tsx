import { cn } from '@/lib/cn'

type Props = {
  className?: string
  children: React.ReactNode
}

export const DialogLayout = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        'w-sm p-6 max-w-screen bg-background-100 rounded-lg mb-30 flex flex-col gap-3 animate-child-in',
        className
      )}
    >
      {children}
    </div>
  )
}
