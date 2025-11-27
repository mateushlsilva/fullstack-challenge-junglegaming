import type { TaskToKanban } from "@/types";
import { ClickableKanbanCard } from "../ClickKableKanbanCard";
import { KanbanBoard, KanbanCards, KanbanHeader, KanbanProvider, type DragEndEvent } from "../ui/shadcn-io/kanban";
import { StatusEnum } from "@/enums";
import { useState } from "react";
import { useKanbanStatus } from '@/hooks';

type TaskKanbanProps = {
    tasks: TaskToKanban[];
    onCardClick: (id: string) => void
}

export function TaskKanban({ tasks, onCardClick }: TaskKanbanProps) {
    const [features, setFeatures] = useState(tasks);
    const kanbanStatus = useKanbanStatus();

    
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
        kanbanStatus.mutate({ id: active.id.toString(), status: over.id as StatusEnum})
        setFeatures(
          features.map((feature) => {
            if (feature.id === active.id) {
              return { ...feature, column: status.id };
            }
            return feature;
          })
        );
      };

    return (
        <KanbanProvider columns={columns} data={tasks} onDragEnd={handleDragEnd}>
                {(column) => (
            <KanbanBoard id={column.id} key={column.id} className="bg-[#1A1A1A] border-0 mt-4 shadow-[#0A0A0A]">
                <KanbanHeader className="border-0">
                <div className="flex items-center justify-center gap-2 bg-[#1A1A1A] border-t-4 border-b-4 border-solid w-full" style={{ borderColor: column.color }}>
                    <span className="text-lg text-center p-2" >{column.name.replace('_', ' ')}</span>
                </div>
                </KanbanHeader>
                <KanbanCards id={column.id}>
                {(feature) => (
                    <ClickableKanbanCard
                    key={feature.id}
                    feature={feature as TaskToKanban}
                    columnName={column.name}
                    formatted={formatted}
                    onCardClick={onCardClick}
                    />
                )}
                </KanbanCards>
            </KanbanBoard>
            )}
        </KanbanProvider>
    )
}