import { Moon, Sun } from 'lucide-react'
import { useId } from 'react'
import { useTheme } from '@/components/theme-provider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/cn'

type ModeToggleProps = {
  className?: string
}

export function ModeToggle({ className }: ModeToggleProps) {
  const { setTheme, theme } = useTheme()
  const id = useId()

  return (
    <div className={cn('relative flex items-center justify-center text-black', className)}>
      <Sun className="absolute h-[0.8rem] w-[0.8rem] transition-all dark:scale-0 dark:-rotate-90 pointer-events-none z-10 right-[2.4px]" />
      <Moon className="absolute h-[0.8rem] w-[0.8rem] transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0 pointer-events-none z-10 left-[2.4px]" />
      <Switch
        defaultChecked={theme !== 'dark'}
        id={id}
        onCheckedChange={(checked) => {
          setTheme(!checked ? 'dark' : 'light')
        }}
      />
    </div>
  )
}
