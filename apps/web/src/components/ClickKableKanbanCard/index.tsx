import { useRef } from "react";
import { KanbanCard } from "../ui/shadcn-io/kanban";
import type { TaskToKanban } from "@/types";
import { PriorityEnum, type StatusEnum } from "@/enums";

type ClicKanbanCard = {
    feature: TaskToKanban;
    columnName: StatusEnum;
    formatted: (date: string | Date | null) => string;
    onCardClick: (id: string) => void;
}

function useClickWithoutDrag(onClick: () => void) {
  const pointerDownRef = useRef<{x: number; y:number} | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!pointerDownRef.current) return;

    const dx = Math.abs(e.clientX - pointerDownRef.current.x);
    const dy = Math.abs(e.clientY - pointerDownRef.current.y);

    // se não arrastou, considera clique
    if (dx < 5 && dy < 5) onClick();

    pointerDownRef.current = null;
  };

  return { onPointerDown, onPointerUp };
}



export function ClickableKanbanCard({ feature, columnName, formatted, onCardClick }: ClicKanbanCard) {

  const { onPointerDown, onPointerUp } = useClickWithoutDrag(() => {
    console.log("Card clicado:", feature)
    onCardClick(feature.id)
  });

  const priorityColor = [
    { id: PriorityEnum.LOW, name: PriorityEnum.LOW, color: '#48BB78' },
    { id: PriorityEnum.MEDIUM, name: PriorityEnum.MEDIUM, color: '#3182CE' },
    { id: PriorityEnum.HIGH, name: PriorityEnum.HIGH, color: '#F6AD55' },
    { id: PriorityEnum.URGENT, name: PriorityEnum.URGENT, color: '#E53E3E' },
  ]

  return (
    <>
    <KanbanCard
      column={columnName}
      id={feature.id}
      key={feature.id}
      name={feature.name}
      className="relative bg-[#2A2A2A] shadow-[#0A0A0A]"
    >
      <div
        className="w-full h-full"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="m-0 flex-1 font-medium text-sm text-white">{feature.name}</p>
          {feature.priority && (
            <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: priorityColor.find((e) => e.id === feature.priority)?.color }}
              />
          )}
        </div>
        <p className="m-0 text-muted-foreground text-xs text-white ">
          Prazo: {formatted(feature.dueDate || null)}
        </p>
      </div>
    </KanbanCard>
    </>
  );
}