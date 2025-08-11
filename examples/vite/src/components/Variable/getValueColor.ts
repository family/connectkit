

const borderValueColor = {
  string: 'border-green-600',
  number: 'border-blue-600',
  boolean: 'border-purple-600',
  null: 'border-gray-500',
  undefined: 'border-gray-500',
  function: 'border-pink-600',
  error: 'border-red-500',
  default: 'border-gray-500',
}

const textValueColor = {
  string: 'text-green-600',
  number: 'text-blue-600',
  boolean: 'text-purple-600',
  null: 'text-gray-500',
  undefined: 'text-gray-500',
  function: 'text-pink-600',
  error: 'text-red-500',
  default: 'text-gray-500',
}

export const getValueColor = (valueType: string, applyTo: 'text' | 'border'): string => {
  const colorMap = applyTo === 'text' ? textValueColor : borderValueColor;
  return colorMap[valueType] || colorMap.default;
};
