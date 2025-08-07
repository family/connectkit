import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_showcase/showcase/app')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_showcase/showcase/app"!</div>
}
