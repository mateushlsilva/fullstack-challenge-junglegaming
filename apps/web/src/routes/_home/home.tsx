import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../../pages'

export const Route = createFileRoute('/_home/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Home/>
}
