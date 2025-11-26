import { useRef } from "react";
import { KanbanCard } from "../ui/shadcn-io/kanban";
import type { TaskToKanban } from "@/types";
import type { StatusEnum } from "@/enums";

type ClicKanbanCard = {
    feature: TaskToKanban;
    columnName: StatusEnum;
    formatted: (date: string | Date | null) => string
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

export function ClickableKanbanCard({ feature, columnName, formatted }: ClicKanbanCard) {
  const { onPointerDown, onPointerUp } = useClickWithoutDrag(() =>
    console.log("Card clicado:", feature)
  );

  return (
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
        </div>
        <p className="m-0 text-muted-foreground text-xs text-white ">
          Prazo: {formatted(feature.dueDate || null)}
        </p>
      </div>
    </KanbanCard>
  );
}