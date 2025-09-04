import { Nav } from '@/components/Nav';
import { useStatus } from '@openfort/react';
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router';
import z from 'zod';

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: z.object({
    focus: z.string().optional(),
  })
})


function RootComponent() {
  const { isConnected } = useStatus();
  const location = useLocation();
  return (
    <div className='flex flex-col min-h-screen w-[100vw]'>
      <Nav showLogo={location.pathname !== "/showcase/auth" || isConnected} />
      <Outlet />
    </div>
  )
}
