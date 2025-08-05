import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { WithNav } from '../components/Nav';

export const Route = createFileRoute('/ui')({
  component: RouteComponent,
    beforeLoad: async ({ location }) => {
      if (location.pathname === '/ui') {
        throw redirect({ to: '/ui/useUI' });
      }
    }
})

function RouteComponent() {
  return (
    <WithNav
      navRoutes={[
        {
          href: '/ui/useUI',
          label: 'useUI',
        },
      ]}
    >
      <Outlet />
    </WithNav>
  )
}
