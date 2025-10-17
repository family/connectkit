import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/cn'

type Props = {
  onBack?: (e: React.MouseEvent<HTMLButtonElement>) => void | false | Promise<void>
  showBack?: boolean
  title: React.ReactNode
  subtitle?: string
  children?: React.ReactNode
  iconSrc?: string
}

export function Header({ onBack, showBack = true, title, subtitle, children, iconSrc }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onBack && showBack) {
        onBack(e as unknown as React.MouseEvent<HTMLButtonElement>)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onBack, showBack])

  return (
    <div
      className={cn(
        'flex flex-col items-center text-center gap-2 max-w-screen px-9 relative',
        iconSrc ? 'mb-4' : 'mb-6'
      )}
    >
      {iconSrc && (
        <div className="mt-2 w-24 h-24 flex items-center justify-center overflow-hidden rounded-[calc(var(--radius-box)*0.5)]">
          <img className="w-full h-full" src={iconSrc || '/logo.png'} alt="Logo" width={48} height={48} />
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-2 w-full max-w-full">
        {onBack && showBack && (
          <button type="button" onClick={onBack} className="btn-ghost btn absolute p-2 left-0">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-2xl font-bold truncate max-w-full">{title}</h1>
        {subtitle && <h2 className="text-base-content/70 max-w-full">{subtitle}</h2>}
        {children}
      </div>
    </div>
  )
}
