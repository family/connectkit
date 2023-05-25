export type SelectProps = { label: string; value: string };

export const Textbox = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="textbox">
      <span>{label}</span>
      <input type="text" value={value ?? ''} onChange={onChange} />
    </label>
  );
};

export const Checkbox = ({
  disabled,
  label,
  value,
  checked,
  onChange,
}: {
  disabled?: boolean;
  label: string;
  value: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <label className="checkbox">
      <input
        disabled={disabled}
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
};

export const Select = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: SelectProps[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <label
      className="select"
      style={{
        width: '100%',
      }}
    >
      <span>{label}</span>
      <select
        value={value}
        onChange={onChange}
        style={{
          boxShadow: '0 0 0 1px #ccc',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};
