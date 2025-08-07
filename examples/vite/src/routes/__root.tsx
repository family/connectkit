import { ModeToggle } from '@/components/mode-toggle';
import { Nav } from '@/components/Nav';
import { OpenfortKitButton } from '@openfort/openfort-kit';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import z from 'zod';

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: z.object({
    focus: z.string().optional(),
  })
})


function RootComponent() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Nav showLogo>
        <div className='flex gap-4 border-l pl-4'>
          <ModeToggle className="scale-110" />
          <div className=''>
            <OpenfortKitButton />
          </div>
        </div>
      </Nav>
      <Outlet />
    </div>
  )
}
