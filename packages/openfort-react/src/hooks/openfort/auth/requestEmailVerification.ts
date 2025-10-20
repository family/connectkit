export const buildCallbackUrl = ({
  email,
  callbackUrl,
  provider,
}: {
  email?: string
  callbackUrl?: string
  provider: string
}) => {
  if (callbackUrl && !callbackUrl.startsWith('http')) {
    callbackUrl = `${window.location.origin}${callbackUrl.startsWith('/') ? '' : '/'}${callbackUrl}`
  }
  const redirectUrl = new URL(callbackUrl || window.location.origin)

  redirectUrl.searchParams.append('openfortAuthProvider', provider)
  if (email) {
    redirectUrl.searchParams.append('email', email)
  }

  return redirectUrl.toString()
}
