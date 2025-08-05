import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { WithNav } from '../components/Nav';

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/auth') {
      throw redirect({ to: '/auth/useGuestAuth' });
    }
  }
})



function RouteComponent() {
  return (
    <WithNav
      navRoutes={[
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
      ]}
    >
      <Outlet />
    </WithNav >
  );
}
