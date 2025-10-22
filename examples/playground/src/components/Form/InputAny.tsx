import type { FunctionInputTypeType } from '@/components/Form/Form'
import { Input } from '@/components/Form/Input'
import { Select } from '@/components/Form/Select'

type InputAnyType = FunctionInputTypeType & {
  required?: boolean
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  name?: string
}

type InputAnyProps = InputAnyType &
  Omit<React.PropsWithChildren<React.HTMLProps<HTMLInputElement | HTMLSelectElement>>, 'onChange'>

export const InputAny = (input: InputAnyProps) => {
  const { name } = input
  if (!input || !input.type) {
    return null // or handle the case where input is not defined
  }

  switch (input.type) {
    case 'select':
      return (
        <Select
          {...(input as React.HTMLProps<HTMLSelectElement>)}
          key={name}
          name={name}
          required={input.required}
          defaultValue={input.defaultValue}
          placeholder={input.placeholder}
          options={input.options}
          onChange={(e) => input.onChange?.(e.currentTarget.value)}
        />
      )
    case 'boolean':
      return (
        <Select
          {...(input as React.HTMLProps<HTMLSelectElement>)}
          key={name}
          name={name}
          required={input.required}
          defaultValue={input.defaultValue}
          placeholder={input.placeholder}
          options={['true', 'false']}
          onChange={(e) => input.onChange?.(e.currentTarget.value)}
        />
      )
    case 'function':
      return (
        <Select
          {...(input as React.HTMLProps<HTMLSelectElement>)}
          key={name}
          name={name}
          required={input.required}
          defaultValue={input.defaultValue}
          placeholder={input.placeholder}
          options={['undefined', 'console.log', 'alert']}
          onChange={(e) => input.onChange?.(e.currentTarget.value)}
        />
      )
    default:
      return (
        <Input
          {...(input as React.HTMLProps<HTMLInputElement>)}
          key={name}
          name={name}
          type={input.type}
          required={input.required}
          defaultValue={input.defaultValue}
          placeholder={input.placeholder}
          onChange={(e) => input.onChange?.(e.currentTarget.value)}
        />
      )
  }
}
