import { InputAny } from "@/components/Form/InputAny";
import { VariableTooltip } from "@/components/Variable/VariableTooltip";
import { alertFn, logFn } from "@/lib/utils";
import { useState } from "react";
import { cn } from "../../lib/cn";
import { BaseVariable } from "../Variable/Variable";

export type FunctionInputTypeType = {
  type?: 'text' | 'email' | 'password' | 'boolean' | 'function';
} | {
  type?: 'select';
  options: (string | { label: string; value: any })[];
}

export type FunctionInputType = {
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  hidden?: boolean;
  onChange?: (value: string) => void;
  description?: string;
  typescriptType?: string;
} & FunctionInputTypeType;

type FormProps<TOptions extends Record<string, any>, TResult = any> = {
  fn: (options: TOptions) => TResult;
  fnName?: string;
  inputs?: Record<keyof TOptions, FunctionInputType>;
  description?: string;
} & React.PropsWithChildren<React.HTMLProps<HTMLFormElement>>

export const Form = <TOptions extends Record<string, any>, TResult = any>({
  fn,
  fnName,
  inputs,
  description,
  children,
  ...props
}: FormProps<TOptions, TResult>) => {

  const [functionResult, setFunctionResult] = useState<any>(null);
  const [functionError, setFunctionError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const options = Object.fromEntries(formData) as Record<string, unknown>;
    Object.keys(options).forEach(key => {
      if (!(key in options)) return;
      if (options[key] === '') options[key] = undefined;
      if (options[key] === 'true') options[key] = true;
      if (options[key] === 'false') options[key] = false;
      if (inputs && inputs[key]) {
        const input = inputs[key]
        if (input.type === 'function') {
          if (options[key] === 'alert') {
            options[key] = alertFn;
          } else if (options[key] === 'console.log') {
            options[key] = logFn;
          } else {
            options[key] = undefined; // Handle other cases or leave as is
          }
        }

        if (input.type === 'select') {
          if (input && 'options' in input) {
            options[key] = (input.options
              ?.find(opt => typeof opt === "object" && opt.value == options[key]) as { value: any })?.value || options[key];
          }
        }
      }
    });
    try {
      setFunctionResult(null);
      setFunctionError(null);
      const res = await fn(options as TOptions);
      setFunctionResult(res);
    } catch (error) {
      setFunctionError(error instanceof Error ? error.message : String(error));
      setFunctionResult(null);
    }
  }


  const getValueType = (val: FunctionInputTypeType["type"]) => {
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    if (Array.isArray(val)) return 'array';
    if (val === "text" || val === "email" || val === "password") return 'string';
    if (typeof val === 'string' && val.includes("Error:")) return 'error';
    return "string";
  };

  return (
    <form
      {...props}
      className="flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <div className="flex gap-2">
          {fnName && <h2 className="text-md font-semibold">
            {fnName}
          </h2>}
          <button
            type="submit"
          >
            Submit
          </button>
        </div>
        {description && <p className="text-sm text-zinc-500">{description}</p>}
      </div>
      <div
        className={cn(
          "flex flex-col gap-2 w-full",
          props.className,
        )}
      >
        {
          inputs && Object.entries(inputs).map(([name, input]) => (
            input.hidden ? null : (
              <div key={name} className="flex gap-2 items-center">
                {name && typeof name === 'string' && (
                  <div className="flex gap-0">
                    <div className="text-xs text-red-500 transform -translate-y-1">
                      {input.required ? '*' : ''}
                    </div>
                    <VariableTooltip
                      name={name}
                      variable={input}
                      actualType={getValueType(input.type)}
                    >
                      {input.required ? (
                        <span className="text-xs text-zinc-500">Required*</span>
                      ) : (
                        <span className="text-xs text-zinc-500">(Optional)</span>
                      )}

                    </VariableTooltip>
                  </div>
                )}
                <InputAny
                  {...input}
                  name={name}
                />
              </div>
            )
          ))
        }
        {children}

        {functionError && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded">
            <div className="text-xs font-medium text-red-800 dark:text-red-200">Error:</div>
            <div className="text-xs text-red-600 dark:text-red-300 font-mono">{functionError}</div>
          </div>
        )}

        {functionResult !== null && !functionError && (
          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded">
            <div className="text-xs font-medium text-green-800 dark:text-green-200 mb-1">Result:</div>
            <BaseVariable
              name="return"
              value={functionResult}
              depth={1}
              maxDepth={10}
              defaultExpanded={1}
            />
          </div>
        )}
      </div>
    </form>
  )
}