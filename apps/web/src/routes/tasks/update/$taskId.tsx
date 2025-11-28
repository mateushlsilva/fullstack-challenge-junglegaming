import { requireAuth } from '@/guards';
import { TaskUpdatePage } from '@/pages';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks/update/$taskId')({
  beforeLoad: () => {
    requireAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { taskId } = Route.useParams();
  const idNumber = Number(taskId);
  return <TaskUpdatePage id={idNumber}/>
}
