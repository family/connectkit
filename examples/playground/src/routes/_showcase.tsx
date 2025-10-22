import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CommonEmailProvider } from '@/components/Showcase/auth/CommonEmailProvider'

export const Route = createFileRoute('/_showcase')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <CommonEmailProvider>
      <div className="min-h-screen pt-(--nav-height) max-w-(--max-screen-width) mx-auto w-full flex">
        <div className="min-h-full flex flex-col w-full items-center justify-center">
          <Outlet />
        </div>
      </div>
    </CommonEmailProvider>
  )
}
