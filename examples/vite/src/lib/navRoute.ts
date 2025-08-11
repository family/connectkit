import { NavRoute } from "@/components/Nav";

export const navRoutes: NavRoute[] = [
  {
    href: '/',
    label: 'Showcase',
    exact: true,
  },
  {
    href: '/provider',
    label: 'Provider',
    exact: true,
  },
  {
    href: '/auth',
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
      }
    ]
  },
  {
    href: '/app',
    label: 'App',
    children: [
      {
        href: '/app/useUser',
        label: 'useUser',
      },
      {
        href: '/app/useWallets',
        label: 'useWallets',
      },
      {
        href: '/app/useUI',
        label: 'useUI',
      },
      {
        href: '/app/useStatus',
        label: 'useStatus',
      },
    ]
  },
  {
    href: '/wagmi',
    label: 'Wagmi Hooks',
    children: [
      {
        href: '/wagmi/useAccount',
        label: 'useAccount',
      },
      {
        href: '/wagmi/useBalance',
        label: 'useBalance',
      },
      {
        href: '/wagmi/useDisconnect',
        label: 'useDisconnect',
      },
      {
        href: '/wagmi/useSwitchChain',
        label: 'useSwitchChain',
      },
    ]
  },
]