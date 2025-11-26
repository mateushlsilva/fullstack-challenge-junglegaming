import { StatusEnum } from "@/enums";
import { SkeletonKanbanCard } from "../SkeletonKanbanCard";
import { KanbanBoard, KanbanHeader, KanbanProvider } from "../ui/shadcn-io/kanban";
import { Skeleton } from "../ui/skeleton";

const skeletonColumns = [
        { id: StatusEnum.TODO, name: StatusEnum.TODO, color: '#6B46C1' },
        { id: StatusEnum.IN_PROGRESS, name: StatusEnum.IN_PROGRESS, color: '#00BCD4' },
        { id: StatusEnum.REVIEW, name: StatusEnum.REVIEW, color: '#F6AD55' },
        { id: StatusEnum.DONE, name: StatusEnum.DONE, color: '#48BB78' },
    ];

export function SkeletonKanbanBoard() {
  return (
    <KanbanProvider
      columns={skeletonColumns}
      data={[]}
      onDragEnd={() => {}}
    >
      {(column) => (
        <KanbanBoard
          id={column.id}
          key={column.id}
          className="bg-[#1A1A1A] border-0 mt-4"
        >
          <KanbanHeader className="border-0">
            <div
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] border-t-4 border-b-4 border-solid w-full"
              style={{ borderColor: column.color }}
            >
              <Skeleton className="h-6 w-24" />
            </div>
          </KanbanHeader>

          <div className="space-y-3 p-2">
            <SkeletonKanbanCard />
            <SkeletonKanbanCard />
            <SkeletonKanbanCard />
          </div>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
}