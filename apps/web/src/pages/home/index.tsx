import { KanbanBoard, KanbanCards,KanbanHeader, KanbanProvider, type DragEndEvent } from "@/components/ui/shadcn-io/kanban"
import { useTaskQuery } from "@/hooks"
import { useTaskStore } from "@/stores";
import { useEffect, useState } from "react";
import { StatusEnum } from "@/enums";
import { ClickableKanbanCard } from "@/components";
import type { TaskToKanban } from "@/types";


function useIsBottom(offset = 100) {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - offset;

      setIsBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return isBottom;
}





function Home() {
    const [ page, setPage ] = useState(1)
    const { isPending  } = useTaskQuery({page: page, size: 20})
    if (isPending) console.log("Ta pegando")
    const tasks = useTaskStore((e) => e.tasks)
    const [features, setFeatures] = useState(tasks);
    console.log(page);
    
    const isBottom = useIsBottom(200);

    const columns = [
        { id: StatusEnum.TODO, name: StatusEnum.TODO, color: '#6B46C1' },
        { id: StatusEnum.IN_PROGRESS, name: StatusEnum.IN_PROGRESS, color: '#00BCD4' },
        { id: StatusEnum.REVIEW, name: StatusEnum.REVIEW, color: '#F6AD55' },
        { id: StatusEnum.DONE, name: StatusEnum.DONE, color: '#48BB78' },
    ];

const formatted = (date: string | Date | null) => {
  if (!date) return "--/--/----";
  const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleString("pt-BR", {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
   
        
    const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const status = columns.find(({ id }) => id === over.id);
    if (!status) {
      return;
    }
    setFeatures(
      features.map((feature) => {
        if (feature.id === active.id) {
          return { ...feature, column: status.id };
        }
        return feature;
      })
    );
  };

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  if (isBottom) setPage((prev) => prev + 1)
}, [isBottom]);

    return (
        <KanbanProvider columns={columns} data={tasks} onDragEnd={handleDragEnd}>
            {(column) => (
        <KanbanBoard id={column.id} key={column.id} className="bg-[#1A1A1A] border-0 mt-4 shadow-[#0A0A0A]">
          <KanbanHeader className="border-0">
          <div className="flex items-center justify-center gap-2 bg-[#1A1A1A] border-t-4 border-b-4 border-solid w-full" style={{ borderColor: column.color }}>
              <span className="text-lg text-center p-2" >{column.name}</span>
            </div>
            </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature) => (
               <ClickableKanbanCard
                key={feature.id}
                feature={feature as TaskToKanban}
                columnName={column.name}
                formatted={formatted}
              />
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
        </KanbanProvider>
    )
}

export default Home