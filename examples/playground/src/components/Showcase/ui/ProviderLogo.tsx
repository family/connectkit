import type { AuthProvider } from '@openfort/react'
import { Globe } from 'lucide-react'
import { Facebook, Google, Twitter } from '@/assets/logos'
import { cn } from '@/lib/cn'

type Props = {
  provider: AuthProvider
  size?: number
  className?: string
}

export const ProviderLogo = ({ provider, size = 16, className }: Props) => {
  const getLogo = () => {
    switch (provider) {
      case 'google':
        return Google
      case 'facebook':
        return Facebook
      case 'twitter':
        return Twitter
      default:
        return Globe
    }
  }
  const Logo = getLogo()

  return <Logo width={size} height={size} className={cn(className)} />
}
