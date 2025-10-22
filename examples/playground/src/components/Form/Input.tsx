import { cn } from '../../lib/cn'

type InputProps = {
  options?: string[]
} & React.PropsWithChildren<React.HTMLProps<HTMLInputElement>>

export const Input = ({ ...props }: InputProps) => {
  return (
    <div className="flex gap-2 items-center w-full">
      {/* {header && <h2 className="text-lg font-semibold">{header}</h2>} */}
      {<input {...props} className={cn('w-full', props.className)} placeholder={props.placeholder ?? props.name} />}
    </div>
  )
}
