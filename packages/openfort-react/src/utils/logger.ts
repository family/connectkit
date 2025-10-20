const PREFIX = '[Openfort-React]'

export const logger = {
  log: (...args: any[]) => console.log(PREFIX, ...args),
  error: (...args: any[]) => console.error(PREFIX, ...args),
  warn: (...args: any[]) => console.warn(PREFIX, ...args),
  info: (...args: any[]) => console.info(PREFIX, ...args),
  debug: (...args: any[]) => console.debug(PREFIX, ...args),
}
