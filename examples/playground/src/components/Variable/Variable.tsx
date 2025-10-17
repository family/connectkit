import { ChevronRight, PenLine } from 'lucide-react'
import { useState } from 'react'
import { InputAny } from '@/components/Form/InputAny'
import { commonVariables } from '@/components/Variable/commonVariables'
import { getFunctionSignature } from '@/components/Variable/getFunctionSignature'
import { getValueColor } from '@/components/Variable/getValueColor'
import { VariableTooltip } from '@/components/Variable/VariableTooltip'
import { cn } from '@/lib/cn'
import { alertFn, logFn } from '@/lib/utils'
import { Form, type FunctionInputType, type FunctionInputTypeType } from '../Form/Form'

type HookFunctions = {
  inputs?: Record<string, FunctionInputType>
}

export type HookInput = {
  description?: string
  typescriptType?: string
  onEdit?: (value: any) => void
  override?: any
} & HookFunctions &
  FunctionInputTypeType

interface VariableProps {
  name: string
  value: any
  className?: string
  depth?: number
  maxDepth?: number
  defaultExpanded?: number
  variables?: Record<string, HookInput>
  focusedVariable?: string
}

const getObjectKeys = (obj: unknown): string[] => {
  if (!obj || typeof obj !== 'object') return []

  const keys = new Set<string>()

  // Get own enumerable properties
  Object.keys(obj).forEach((key) => keys.add(key))

  // Get non-enumerable properties
  Object.getOwnPropertyNames(obj).forEach((key) => keys.add(key))

  // Get symbol properties
  Object.getOwnPropertySymbols(obj).forEach((sym) => {
    keys.add(sym.toString())
  })

  return Array.from(keys)
    .sort((a, b) => {
      const typeA = typeof obj[a]
      const typeB = typeof obj[b]
      if (typeA === typeB) {
        return a.localeCompare(b)
      }
      if (typeA === 'function' || typeB === 'function') {
        return typeA === 'function' ? 1 : -1 // Functions last
      }
      if (typeA === 'object' || typeB === 'object') {
        return typeA === 'object' ? 1 : -1 // Objects last
      }
      return a.localeCompare(b)
    })
    .sort()
}

const formatValue = (val: any, valueType: string, _name: string) => {
  switch (valueType) {
    case 'string':
      return `"${val}"`
    case 'number':
    case 'boolean':
      return String(val)
    case 'null':
      return 'null'
    case 'undefined':
      return 'undefined'
    case 'function': {
      const signature = getFunctionSignature(val)
      return `ƒ ${signature}`
    }
    case 'array':
      return `Array(${val.length})`
    case 'object': {
      const constructor = val.constructor?.name || 'Object'
      const keys = getObjectKeys(val)
      return `${constructor} {${keys.length} ${keys.length === 1 ? 'property' : 'properties'}}`
    }
    case 'date':
      return val.toISOString()
    case 'regexp':
      return val.toString()
    case 'error':
      return `${val.name}: ${val.message}`
    default:
      return String(val)
  }
}

const EditableVariable = ({
  variable,
  value,
  onChange,
  actualType = 'string',
  name,
}: {
  variable: HookInput
  value: any
  onChange: (value: any) => void
  actualType?: string
  name: string
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onChange(valueState)
      setIsEditing(false)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsEditing(false)
    }
  }
  const [valueState, setValueState] = useState<string>(value)

  const handleChange = (value: string) => {
    setValueState(value)
    switch (variable.type) {
      case 'select':
        onChange(variable.options?.find((opt) => typeof opt === 'object' && opt.value === value) || value)
        break
      case 'boolean':
        onChange(value === 'true')
        break
      case 'function':
        if (value === 'alert') {
          onChange(alertFn)
        } else if (value === 'console.log') {
          onChange(logFn)
        } else {
          onChange(undefined) // Handle other cases or leave as is
        }

        break
    }
  }

  const handleBlur = () => {
    switch (variable.type) {
      case 'select':
      case 'boolean':
      case 'function':
        break
      default:
        onChange(valueState)
    }
    setIsEditing(false)
  }

  return (
    <div className="group/edit relative w-full">
      <button
        type="button"
        className={cn(getValueColor(actualType, 'text'), 'flex items-center gap-1 relative')}
        onClick={(e) => {
          e.stopPropagation()
          setIsEditing(!isEditing)
        }}
      >
        <span>{formatValue(value, actualType, name)}</span>
        <PenLine
          size={12}
          className="opacity-50 group-hover:opacity-70 group-hover/edit:opacity-100 transition-all duration-300"
        />
        <span
          // Underline
          className={cn(
            getValueColor(actualType, 'border'),
            'absolute right-0 left-0 bottom-0 border-b  border-dashed opacity-0 transition-all duration-300 group-hover:opacity-50 group-hover/edit:opacity-100'
          )}
        />
      </button>
      {isEditing && (
        <div className={cn(actualType === 'select' ? '-left-3' : 'left-0', 'absolute -top-2 max-w-full w-lg z-10')}>
          <InputAny
            className="bg-background p-2 rounded-lg"
            type={variable.type || 'text'}
            options={variable.type === 'select' ? (variable.options ?? []) : []}
            value={valueState}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      )}
    </div>
  )
}

export const BaseVariable = ({
  name,
  value,
  className = '',
  depth = 0,
  maxDepth = 100,
  defaultExpanded = 0,
  focusedVariable,
  variables = {},
}: VariableProps) => {
  const [isExpanded, setIsExpanded] = useState(depth < defaultExpanded)

  const getValueType = (val: unknown) => {
    if (val === null) return 'null'
    if (val === undefined) return 'undefined'
    if (Array.isArray(val)) return 'array'
    if (val instanceof Date) return 'date'
    if (val instanceof RegExp) return 'regexp'
    if (val instanceof Error) return 'error'
    if (typeof val === 'string' && val.includes('Error:')) return 'error'
    return typeof val
  }

  const variable = variables[name] || commonVariables[name]
  const hasVariable = variable !== undefined && variable !== null
  const isEditable = hasVariable && !!variable.onEdit

  const actualType = getValueType(value)
  const isExpandable =
    (actualType === 'object' || actualType === 'array' || (actualType === 'function' && hasVariable)) &&
    value !== null &&
    depth < maxDepth

  const renderExpandedContent = () => {
    if (!isExpandable || !isExpanded) return null

    if (actualType === 'function') {
      if (!variable) return null
      return (
        <div className="bg-background-100 border dark:border-zinc-700 p-4 pt-2 rounded-lg m-2 max-w-lg">
          <Form
            fn={variable.override ?? value}
            fnName={name}
            inputs={variable.inputs || {}}
            description={variable.description}
          />
        </div>
      )
    }

    const keys = getObjectKeys(value)

    if (keys.length === 0) {
      return (
        <div className="ml-4 text-gray-500 dark:text-gray-400 text-sm">
          {actualType === 'array' ? 'Empty array' : 'Empty object'}
        </div>
      )
    }

    return (
      <div className="ml-[6.5px] border-l border-gray-200 dark:border-gray-600 pl-4 flex flex-col gap-0.5 pt-1">
        {keys.map((key, _index) => {
          try {
            const propValue = value[key]
            return (
              <BaseVariable
                key={key}
                name={key}
                value={propValue}
                depth={depth + 1}
                maxDepth={maxDepth}
                className="mb-1"
                variables={variables}
                defaultExpanded={defaultExpanded}
                focusedVariable={focusedVariable}
              />
            )
          } catch (_error) {
            return (
              <div key={key} className="mb-1 text-red-500 dark:text-red-400">
                "{key}": [Error accessing property]
              </div>
            )
          }
        })}
      </div>
    )
  }

  const renderName = (name: string) => (
    <span className="text-gray-700 dark:text-gray-300 font-medium">
      <VariableTooltip name={name} variable={variable} actualType={actualType} />
    </span>
  )

  if (!isExpandable || isEditable) {
    // Non-expandable values (primitives, etc.)
    return (
      <div
        className={cn(
          'flex items-center gap-2 font-mono text-sm group/parent',
          focusedVariable === name ? 'animate-focus' : '',
          !isEditable && 'overflow-hidden',
          className
        )}
      >
        {!(actualType === 'undefined' && !hasVariable) && renderName(name)}
        {actualType === 'undefined' && !hasVariable && (
          <span className="text-gray-700 dark:text-gray-300 font-medium">{name}:</span>
        )}
        <span className={cn(getValueColor(actualType, 'text'), 'relative break-all')}>
          {isEditable ? (
            <EditableVariable
              variable={variable}
              value={value}
              onChange={variable.onEdit!}
              actualType={actualType}
              name={name}
            />
          ) : (
            formatValue(value, actualType, name)
          )}
        </span>
      </div>
    )
  }

  const getArrayId = () => {
    if (Number.isNaN(Number(name))) return name

    if ('id' in value) return value.id

    if ('provider' in value) return value.provider

    return name
  }

  // Expandable objects/arrays
  return (
    <div className={cn(className, focusedVariable === name ? 'animate-focus' : '')}>
      <div
        className="flex items-center gap-1 cursor-pointer group/parent rounded"
        role="button"
        tabIndex={0}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsExpanded(!isExpanded)
          }
        }}
      >
        <ChevronRight
          size={14}
          className={cn(
            'text-gray-600 group-hover/parent:text-gray-400 transition-transform duration-200',
            isExpanded && 'rotate-90'
          )}
        />

        {renderName(getArrayId())}

        <span className={cn('font-mono text-sm', getValueColor(actualType, 'text'))}>
          {formatValue(value, actualType, name)}
        </span>
      </div>
      {renderExpandedContent()}
    </div>
  )
}

export const Variable = ({
  name,
  description,
  values,
  variables = {},
  defaultExpanded = 0,
  maxDepth = 3,
}: {
  name: string
  description?: string
  values: Record<string, any>
  variables?: Record<string, HookInput>
  defaultExpanded?: number
  maxDepth?: number
}) => {
  return (
    <div className="flex flex-col gap-4 font-mono text-sm">
      <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">{name}</span>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      {Object.keys(values).length === 0 ? (
        <span className="text-gray-500">No variables</span>
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
            .map(([key, value]) => (
              <BaseVariable
                key={key}
                name={key}
                value={value}
                depth={0}
                maxDepth={maxDepth}
                variables={variables}
                defaultExpanded={defaultExpanded}
              />
            ))}
        </div>
      )}
    </div>
  )
}
