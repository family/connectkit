import { cn } from "@/lib/cn"

export const Logo = ({ className }: { className?: string }) => {
  return (
    <>
      <img
        src="/openfort-playground-dark.svg"
        alt="Openfort Logo"
        className={cn('h-8 dark:hidden', className)}
      />
      <img
        src="/openfort-playground-light.svg"
        alt="Openfort Logo"
        className={cn('h-8 hidden dark:block', className)}
      />
    </>
  )
}
