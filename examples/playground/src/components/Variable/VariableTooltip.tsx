import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getValueColor } from '@/components/Variable/getValueColor'

export const VariableTooltip = ({
  name,
  variable,
  actualType = 'string',
  children,
}: {
  name: string
  variable?: {
    typescriptType?: string
    description?: string
  }
  actualType?: string
  children?: React.ReactNode
}) => (
  <Tooltip delayDuration={500}>
    <TooltipTrigger className="relative cursor-help whitespace-nowrap" onClick={(e) => e.preventDefault()}>
      {name}
      <span
        // Underline
        className="absolute right-2 left-0 bottom-0 border-b border-zinc-600 group-hover/parent:border-zinc-400 border-dashed opacity-0 transition-all duration-300 group-hover:opacity-100"
      />
      :
    </TooltipTrigger>
    <TooltipContent>
      <div className="overflow-y-auto text-sm max-h-40 max-w-xs overflow-x-hidden overflow-y-auto">
        <span className=" font-mono">{name}: </span>
        <span className={getValueColor(actualType, 'text')}>
          {variable?.typescriptType ? variable.typescriptType : actualType}
        </span>
        {variable?.description && <div className="mt-2 text-zinc-500">{variable.description}</div>}
        <div>{children}</div>
      </div>
    </TooltipContent>
  </Tooltip>
)
