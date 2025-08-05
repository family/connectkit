import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { WithNav } from '../components/Nav';

export const Route = createFileRoute('/user')({
  component: RouteComponent,
    beforeLoad: async ({ location }) => {
      if (location.pathname === '/user') {
        throw redirect({ to: '/user/useUser' });
      }
    }
})

function RouteComponent() {
  return (
    <WithNav
      navRoutes={[
        {
          href: '/user/useUser',
          label: 'useUser',
        },
      ]}
    >
      <Outlet />
    </WithNav>
  )
}
