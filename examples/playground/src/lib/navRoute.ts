import type { NavRoute } from '@/components/Nav'

export const navRoutes: NavRoute[] = [
  {
    label: 'Auth hooks',
    children: [
      {
        href: '/auth/useGuestAuth',
        label: 'useGuestAuth',
      },
      {
        href: '/auth/useEmailAuth',
        label: 'useEmailAuth',
      },
      {
        href: '/auth/useOauth',
        label: 'useOauth',
      },
      {
        href: '/auth/useAuthCallback',
        label: 'useAuthCallback',
      },
      {
        href: '/auth/useWalletAuth',
        label: 'useWalletAuth',
      },
      {
        href: '/auth/useSignOut',
        label: 'useSignOut',
      },
      {
        href: '/auth/useUser',
        label: 'useUser',
      },
    ],
  },
  {
    label: 'Wallet hooks',
    children: [
      {
        href: '/wallet/useWallets',
        label: 'useWallets',
      },
    ],
  },
  {
    label: 'Utils',
    children: [
      {
        href: '/utils/useUI',
        label: 'useUI',
      },
      {
        href: '/wagmi',
        label: 'wagmi',
      },
    ],
  },
]
