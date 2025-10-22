export const buildCallbackUrl = ({
  email,
  callbackUrl,
  provider,
  isOpen,
}: {
  email?: string
  callbackUrl?: string
  provider: string
  isOpen: boolean
}) => {
  if (callbackUrl && !callbackUrl.startsWith('http')) {
    callbackUrl = `${window.location.origin}${callbackUrl.startsWith('/') ? '' : '/'}${callbackUrl}`
  }
  const redirectUrl = new URL(callbackUrl || window.location.origin)

  redirectUrl.searchParams.append('openfortAuthProvider', provider)
  if (email) {
    redirectUrl.searchParams.append('email', email)
  }
  if (isOpen) {
    redirectUrl.searchParams.append('openfortEmailVerificationUI', 'true')
  }

  return redirectUrl.toString()
}
