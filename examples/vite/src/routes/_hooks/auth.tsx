import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_hooks/auth')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/auth') {
      throw redirect({ to: '/auth/useGuestAuth' });
    }
  }
})



function RouteComponent() {
  return (
    <Outlet />
  );
}
