export const alertFn = (alert: any) => {
  if (typeof alert !== 'string') {
    // result = `${key}: ${JSON.stringify(result, null, 2)}`;
    alert = `${JSON.stringify(alert, null, 2)}`
  }
  window.alert(alert?.toString())
}

export const logFn = (log: any) => {
  console.log(log)
}
