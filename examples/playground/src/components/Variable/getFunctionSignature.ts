export const getFunctionSignature = (func: (...args: any[]) => any): string => {
  const funcStr = func.toString()
  const match = funcStr.match(/^(?:async\s+)?(?:function\s*)?[^(]*\(([^)]*)\)/)
  if (match) {
    if (match[0].includes('function')) {
      const params = match[1]
        .split(',')
        .map((p) => p.trim().split('=')[0].trim())
        .filter((p) => p)
      return `(${params.join(', ')})`
    }
    return `${match[0].split('=>')[0].toString()} => {...}`
  }
  return '()'
}
