import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonTaskDialog() {
  return (
    <div className="sm:max-w-[700px] bg-[#1A1A1A] border border-gray-700 text-white p-6 rounded-lg animate-pulse">
      <div className="flex flex-col gap-4">
    
        <Skeleton className="h-8 w-1/2 rounded" />

        <Skeleton className="h-10 w-full rounded" />
        <Skeleton className="h-24 w-full rounded" />

        
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 rounded" />
          <Skeleton className="h-10 flex-1 rounded" />
          <Skeleton className="h-10 flex-1 rounded" />
        </div>

      
        <Skeleton className="h-40 w-full rounded" />

        
        <div className="flex gap-2 justify-end mt-4">
          <Skeleton className="h-10 w-24 rounded" />
          <Skeleton className="h-10 w-32 rounded" />
        </div>
      </div>
    </div>
  );
}
