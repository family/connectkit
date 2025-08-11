import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
    <Outlet />
  )
}
