import { FunctionInputType } from "@/components/Form/Form";
import { HookInput } from "@/components/Variable/Variable";

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
    typescriptType: '(error: OpenfortKitError) => void',
    description: 'Callback function to execute on error.',
  },
  onSettled: {
    type: 'function',
    typescriptType: '(data: any, error: OpenfortKitError) => void',
    description: 'Callback function to execute when the operation is settled (either success or error).',
  },
};

export const onSettledOptions = {
  throwOnError: false,
  onSuccess: undefined,
  onError: undefined,
  onSettled: undefined,
};




export const commonVariables = {
  ...onSettledInputs,
  error: {
    typescriptType: 'OpenfortKitError | null',
    description: 'The error object if an error occurred, otherwise null.',
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