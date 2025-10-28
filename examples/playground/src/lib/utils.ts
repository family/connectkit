export const alertFn = (alert: any) => {
  if (typeof alert !== 'string') {
    // result = `${key}: ${JSON.stringify(result, null, 2)}`;
    alert = `${JSON.stringify(alert, null, 2)}`
  }

  // biome-ignore lint/suspicious/noAlert: for debugging purposes
  window.alert(alert?.toString())
}

export const logFn = (_log: any) => {}
