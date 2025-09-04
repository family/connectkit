import { cn } from "../../lib/cn";

type SelectProps = {
  options: (string | { label: string; value: any })[];
} & React.PropsWithChildren<React.HTMLProps<HTMLSelectElement>>

export const Select = ({
  options,
  ...props
}: SelectProps) => {
  if (!options || options.length === 0) {
    return null; // or handle the case where no options are provided
  }

  return (
    <select
      {...props}
      className={cn(
        "w-full",
        props.className,
      )}
    >
      {options?.map((option) => (
        typeof option === 'object' ? (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ) : (
          <option key={option} value={option}>
            {option}
          </option>
        )
      ))}
      {props.children}
    </select>
  )
}