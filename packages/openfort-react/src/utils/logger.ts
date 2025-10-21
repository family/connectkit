const PREFIX = '[Openfort-React]'

export const logger = {
  log: (...args: any[]) => console.log(PREFIX, ...args),
  error: (...args: any[]) => console.error(PREFIX, ...args),
  warn: (...args: any[]) => console.warn(PREFIX, ...args),
  info: (..._args: any[]) => {},
  debug: (..._args: any[]) => {},
}
