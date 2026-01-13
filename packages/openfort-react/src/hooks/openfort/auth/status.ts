import type { OpenfortError } from '../../../types'

export type BaseFlowState =
  | {
      status: 'idle' | 'awaiting-input' | 'loading' | 'success'
      error?: never
    }
  | {
      status: 'error'
      error: OpenfortError | null
    }

export const mapStatus = (status: BaseFlowState | { status: string }) => {
  return {
    isLoading: status.status === 'loading',
    isError: status.status === 'error',
    isSuccess: status.status === 'success',
    error: 'error' in status ? status.error : undefined,
  }
}
