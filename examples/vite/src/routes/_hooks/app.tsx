import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
    <Outlet />
  )
}
