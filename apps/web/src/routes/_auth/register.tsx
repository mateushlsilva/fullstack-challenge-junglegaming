import { createFileRoute } from '@tanstack/react-router'
import { Register } from '../../pages'

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Register/>
}
