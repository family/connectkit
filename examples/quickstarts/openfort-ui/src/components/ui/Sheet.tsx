import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

type SheetProps = {
  open: boolean
  onClose: () => void
  title: string
  description: string
  children: React.ReactNode
}

const SheetInner = ({ onClose, title, description, children }: SheetProps) => {
  const [isClosing, setIsClosing] = useState(false)
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(onClose, 300)
      return () => clearTimeout(timer)
    }
  }, [isClosing, onClose])

  return (
    <div
      className="flex flex-col m-0 p-4 absolute inset-0 bg-zinc-800 data-[closing=false]:animate-sheet-in data-[closing=true]:animate-sheet-out outline-l outline-1 outline-zinc-700"
      data-closing={isClosing}
    >
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          className="rounded p-2 hover:text-white transition-colors cursor-pointer"
          onClick={() => setIsClosing(true)}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h2 className="mb-0">{title}</h2>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export const Sheet = (props: SheetProps) => {
  if (!props.open) return null

  return <SheetInner {...props} />
}
