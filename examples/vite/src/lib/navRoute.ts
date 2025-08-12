import { NavRoute } from "@/components/Nav";

export const navRoutes: NavRoute[] = [
  {
    label: 'Auth',
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
    ]
  },
  {
    label: 'Wallet',
    children:[
      {
        href: '/wallet/useWallet',
        label: 'useWallet',
        exact: true,
      },
      {
        href: '/wallet/useWallets',
        label: 'useWallets',
      },
    ]
  },
  {
    label: 'Utils',
    children: [
      {
        href: '/utils/useUI',
        label: 'useUI',
      },
      {
        href: '/utils/useStatus',
        label: 'useStatus',
      },
      {
        href: '/wagmi',
        label: 'wagmi',
      }
    ]
  },
]