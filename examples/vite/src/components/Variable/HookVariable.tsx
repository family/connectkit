import { BaseVariable, HookInput } from "@/components/Variable/Variable";
import { onSettledInputs } from "@/components/Variable/commonVariables";
import { useState } from "react";


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
  hook: (opts: TOptions) => TResult;
  name: string;
  description?: string;
  variables?: Record<string, HookInput>;
  defaultExpanded?: number;
  maxDepth?: number;
  defaultOptions?: TOptions;
  optionsVariables?: Record<string, HookInput>;
}) => {
  const [opts, setOpts] = useState<TOptions>(defaultOptions);

  const values = hook(opts);

  return (
    <div className="flex flex-col gap-2 font-mono text-sm">
      <h2 className="text-gray-700 dark:text-gray-300 font-medium text-xl">
        {name}
      </h2>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <div className="flex flex-col gap-2 mb-4">
        <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
          Options
        </span>
        {
          Object.keys(opts).length === 0 ? (
            <span className="text-gray-500">No options</span>
          ) : (
            <div className="flex flex-col gap-2 group">
              {
                Object.entries(opts ?? {})
                  .map(([key, value]) => (
                    <BaseVariable
                      key={key}
                      name={key}
                      value={value}
                      depth={0}
                      maxDepth={maxDepth}
                      variables={{
                        [key]: {
                          ...(optionsVariables?.[key] ?? onSettledInputs[key] ?? {}),
                          onEdit: (newValue: any) => {
                            setOpts((prev) => ({
                              ...prev,
                              [key]: newValue,
                            }));
                          }
                        }
                      }}
                      defaultExpanded={defaultExpanded}
                    />
                  ))
              }
            </div>
          )
        }
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
          Values
        </span>
        {
          Object.keys(values).length === 0 ? (
            <span className="text-gray-500">No values</span>
          ) : (
            <div className="flex flex-col gap-2 group">
              {Object
                .entries(values)
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
                ))
              }
            </div>
          )
        }
      </div>
    </div>
  )
}
