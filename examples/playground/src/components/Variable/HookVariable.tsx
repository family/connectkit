import { useNavigate, useSearch } from '@tanstack/react-router'
import { CheckIcon, Code2Icon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { commonVariables, onSettledInputs } from '@/components/Variable/commonVariables'
import { BaseVariable, type HookInput } from '@/components/Variable/Variable'
import { cn } from '@/lib/cn'

export const HookVariable = <TOptions extends object, TResult extends object>({
  hook,
  name,
  description,
  variables = {},
  defaultExpanded = 0,
  maxDepth = 3,
  defaultOptions = {} as TOptions,
  optionsVariables,
}: {
  hook: (opts: TOptions) => TResult
  name: string
  description?: string
  variables?: Record<string, HookInput>
  defaultExpanded?: number
  maxDepth?: number
  defaultOptions?: TOptions
  optionsVariables?: Record<string, HookInput>
}) => {
  const [opts, setOpts] = useState<TOptions>(defaultOptions)

  const values = hook(opts)

  const sample = useMemo(() => {
    let base = `${JSON.stringify(Object.keys(defaultOptions), null, 2)}`
    base = base.replace(
      ']',
      `  })
  // ...
}`
    )
    while (base.includes('"')) {
      base = base.replace('"', '')
    }
    while (base.includes(',')) {
      base = base.replace(',', '')
    }
    base = base.replace(
      '[',
      `import { ${name} } from "@openfort/react"

function SampleComponent() {
  const {
    --${Object.keys(values).join(`
    --`)}
  } = ${name}({`
    )

    for (const val in values) {
      const replaced = variables?.[val]?.description || commonVariables[val as string]?.description
      base = base.replace(`--${val}`, `${val},${replaced ? ` // ${replaced}` : ''}`)
    }

    for (const opt in defaultOptions) {
      const replaced = optionsVariables?.[opt]?.description || onSettledInputs[opt]?.description
      base = base.replace(opt, `  ${opt},${replaced ? ` // ${replaced}` : ''}`)
    }

    base = base.replace('{  }', '')

    return base
  }, [defaultOptions, name, optionsVariables, values, variables])

  const params = useSearch({ strict: false })
  const navigate = useNavigate()
  useEffect(() => {
    if (params.focus) {
      return clearTimeout(
        setTimeout(() => {
          navigate({
            to: '.',
            search: (prev) => {
              // biome-ignore lint/correctness/noUnusedVariables: focus is intentionally destructured to exclude it
              const { focus, ...rest } = prev
              return rest
            },
            replace: true,
          })
        }, 2000)
      )
    }
  }, [params.focus, navigate])

  const [copied, setCopied] = useState(false)

  return (
    <div className="flex flex-col gap-2 font-mono text-sm">
      <h2 className="text-gray-700 dark:text-gray-300 font-medium text-xl">
        {name}
        <Tooltip delayDuration={500}>
          <TooltipTrigger asChild>
            <button
              className="btn btn-accent btn-sm btn-circle ml-2 size-7 relative"
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(sample)
                setCopied(true)
                setTimeout(() => {
                  setCopied(false)
                }, 1500)
              }}
            >
              <CheckIcon
                className={cn(
                  'absolute size-4.5 inline-block transition-opacity duration-300',
                  copied ? 'opacity-100' : 'opacity-0'
                )}
              />
              <Code2Icon
                className={cn(
                  'absolute size-4.5 inline-block transition-opacity duration-300',
                  copied ? 'opacity-0' : 'opacity-100'
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>Copy sample code</TooltipContent>
        </Tooltip>
        <span className={cn('text-xs ml-1 transition-opacity duration-300', copied ? 'opacity-100' : 'opacity-0')}>
          Copied
        </span>
      </h2>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Options</span>
        {Object.keys(opts).length === 0 ? (
          <span className="text-gray-500">No options</span>
        ) : (
          <div className="flex flex-col gap-2 group">
            {Object.entries(opts ?? {}).map(([key, value], i) => (
              <BaseVariable
                focusedVariable={params.focus}
                // biome-ignore lint/suspicious/noArrayIndexKey: allowed for simplicity
                key={key + i}
                name={key}
                value={value}
                depth={0}
                maxDepth={maxDepth}
                variables={{
                  [key]: {
                    ...(optionsVariables?.[key] ?? onSettledInputs[key] ?? {}),
                    onEdit: (newValue: Record<string, unknown>) => {
                      setOpts((prev) => ({
                        ...prev,
                        [key]: newValue,
                      }))
                    },
                  },
                }}
                defaultExpanded={defaultExpanded}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">Values</span>
        {Object.keys(values).length === 0 ? (
          <span className="text-gray-500">No values</span>
        ) : (
          <div className="flex flex-col gap-2 group">
            {Object.entries(values)
              .sort()
              // .sort(([a], [b]) => {
              //   const typeA = typeof values[a]
              //   const typeB = typeof values[b];
              //   if (typeA === typeB) {
              //     return a.localeCompare(b);
              //   }
              //   if (typeA === "function" || typeB === "function") {
              //     return typeA === "function" ? 1 : -1; // Functions last
              //   }
              //   if (typeA === "object" || typeB === "object") {
              //     return typeA === "object" ? 1 : -1; // Objects last
              //   }
              //   return a.localeCompare(b);
              // })
              .map(([key, value], i) => (
                <BaseVariable
                  // biome-ignore lint/suspicious/noArrayIndexKey: allowed for simplicity
                  key={key + i}
                  name={key}
                  value={value}
                  depth={0}
                  maxDepth={maxDepth}
                  variables={variables}
                  defaultExpanded={defaultExpanded}
                  focusedVariable={params.focus}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
