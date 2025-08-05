import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { WithNav } from '../components/Nav';

export const Route = createFileRoute('/wallet')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/wallet') {
      throw redirect({ to: '/wallet/useWallets' });
    }
  }
})



function RouteComponent() {
  return (
    <WithNav
      navRoutes={[{
        href: '/wallet/useWallets',
        label: 'useWallets',
      }]}
    >
      <Outlet />
    </WithNav>
  );
}
