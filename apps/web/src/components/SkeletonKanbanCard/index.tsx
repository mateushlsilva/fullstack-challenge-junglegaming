import { Skeleton } from "../ui/skeleton";

export function SkeletonKanbanCard() {
  return (
    <div className="p-4 rounded-md bg-[#1F1F1F] border border-[#2A2A2A] space-y-3">
      <Skeleton className="h-4 w-3/4" /> 
      <Skeleton className="h-3 w-1/2" /> 
    </div>
  );
}