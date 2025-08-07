import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { WithNav } from '../../components/Nav';

export const Route = createFileRoute('/_hooks/app')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/app') {
      throw redirect({ to: '/app/useUser' });
    }
  }
})

function RouteComponent() {
  return (
    <WithNav
      navRoutes={[
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
      ]}
    >
      <Outlet />
    </WithNav>
  )
}
