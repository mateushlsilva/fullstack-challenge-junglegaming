import { createFileRoute } from '@tanstack/react-router'
import { Home } from '../../pages'
import { requireAuth } from '@/guards'

export const Route = createFileRoute('/_home/home')({
  beforeLoad: () => {
    requireAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Home/>
}
