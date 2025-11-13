// biome-ignore-all lint/suspicious/noConsole: Logger utility using console methods

export const logger = {
  error: (...args: unknown[]) => console.error(...args),
  warn: (...args: unknown[]) => console.warn(...args),
  info: (...args: unknown[]) => console.log(...args),
  success: (...args: unknown[]) => console.log(...args),
};
