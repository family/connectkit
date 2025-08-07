import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { WithNav } from '../../components/Nav';

export const Route = createFileRoute('/_hooks/wagmi')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/wagmi') {
      throw redirect({ to: '/wagmi/useAccount' });
    }
  }
})

function RouteComponent() {
  return (
    <WithNav
      navRoutes={[
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
      ]}
    >
      <Outlet />
    </WithNav>
  )
}
