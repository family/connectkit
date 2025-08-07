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
    label: 'Auth'
  },
  {
    href: '/app',
    label: 'App'
  },
  {
    href: '/wagmi',
    label: 'Wagmi Hooks'
  },
]