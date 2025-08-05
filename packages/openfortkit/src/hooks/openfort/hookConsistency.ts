import { OpenfortHookOptions, OpenfortKitError } from "../../types";


export const onSuccess = <T>({
  hookOptions,
  options,
  data,
}: {
  hookOptions?: OpenfortHookOptions<T>;
  options?: OpenfortHookOptions<T>;
  data: T;
}) => {
  hookOptions?.onSuccess?.(data);
  hookOptions?.onSettled?.(data, null);
  options?.onSuccess?.(data);
  options?.onSettled?.(data, null);

  return data;
}

export const onError = <T,>({
  hookOptions,
  options,
  error,
}: {
  hookOptions?: OpenfortHookOptions<T>;
  options?: OpenfortHookOptions<T>;
  error: OpenfortKitError;
}) => {
  hookOptions?.onError?.(error);
  hookOptions?.onSettled?.(null, error);
  options?.onError?.(error);
  options?.onSettled?.(null, error);

  if (hookOptions?.throwOnError || options?.throwOnError)
    throw error;

  return { error };
}
