import type { FunctionInputType } from '@/components/Form/Form'
import type { HookInput } from '@/components/Variable/Variable'

export const onSettledInputs: Record<string, HookInput | FunctionInputType> = {
  throwOnError: {
    type: 'boolean',
    description: 'Whether to throw errors.',
    defaultValue: 'false',
  },
  onSuccess: {
    type: 'function',
    typescriptType: '(data: any) => void',
    description: 'Callback function to execute on success.',
  },
  onError: {
    type: 'function',
    typescriptType: '(error: OpenfortError) => void',
    description: 'Callback function to execute on error.',
  },
  onSettled: {
    type: 'function',
    typescriptType: '(data: any, error: OpenfortError) => void',
    description: 'Callback function to execute when the operation is settled (either success or error).',
  },
}

export const onSettledOptions = {
  throwOnError: false,
  onSuccess: undefined,
  onError: undefined,
  onSettled: undefined,
}

export const commonVariables = {
  ...onSettledInputs,
  error: {
    typescriptType: 'OpenfortError | null',
    description: 'The error object if an error occurred, otherwise null.',
  },
  reset: {
    description: 'Resets the state of the hook. (e.g. if isError resets to being without error)',
  },
  isLoading: {
    typescriptType: 'boolean',
    description: 'Indicates if the hook is currently loading.',
  },
  isError: {
    typescriptType: 'boolean',
    description: 'Indicates if the hook has encountered an error.',
  },
  isSuccess: {
    typescriptType: 'boolean',
    description: 'Indicates if the hook has successfully completed.',
  },
}
