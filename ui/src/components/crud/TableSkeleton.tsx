import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showFilters?: boolean;
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 5, 
  showFilters = true 
}: TableSkeletonProps) {
  return (
    <div className="animate-fade-in">
      {/* Filter skeleton */}
      {showFilters && (
        <div className="flex flex-col gap-3 p-4 border-b border-border">
          <Skeleton className="h-10 w-full" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-full sm:w-40" />
            <Skeleton className="h-10 w-full sm:w-40" />
          </div>
        </div>
      )}

      {/* Table skeleton */}
      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex gap-4 pb-2 border-b border-border">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4 flex-1" />
          ))}
        </div>

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex gap-4 py-3 border-b border-border/50">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={`cell-${rowIndex}-${colIndex}`} 
                className="h-4 flex-1"
                style={{ 
                  animationDelay: `${(rowIndex * 50) + (colIndex * 25)}ms` 
                }}
              />
            ))}
          </div>
        ))}

        {/* Pagination skeleton */}
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
