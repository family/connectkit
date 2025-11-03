import { cn } from '@/lib/cn'

export const Logo = ({ className }: { className?: string }) => {
  return (
    <>
      <img
        src="/openfort-playground-dark.svg"
        alt="Openfort Logo"
        className={cn('h-8 dark:hidden sm:block hidden', className)}
      />
      <img
        src="/openfort-playground-light.svg"
        alt="Openfort Logo"
        className={cn('h-8 hidden sm:dark:block sm:hidden', className)}
      />
      {/* Small Screens */}
      <img src="/openfort-dark.svg" alt="Openfort Logo" className={cn('h-8 sm:hidden dark:hidden', className)} />
      <img
        src="/openfort-light.svg"
        alt="Openfort Logo"
        className={cn('h-8 dark:sm:hidden dark:block hidden', className)}
      />
    </>
  )
}
