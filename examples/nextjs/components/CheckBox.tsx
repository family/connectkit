import React from "react"

type Props = {
  children?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

export const CheckBox = ({ children, ...props }: Props) => (
  <label className="inline-flex items-center my-2 ml-1 cursor-pointer">
    <input
      type="checkbox"
      className={"sr-only peer" + (props.className ? ` ${props.className}` : "")}
      {...props}
    />
    <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
    {children}
  </label>
)