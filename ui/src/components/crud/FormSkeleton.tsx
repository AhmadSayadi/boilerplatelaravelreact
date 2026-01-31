import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FormSkeletonProps {
  fields?: number;
  showCard?: boolean;
  showHeader?: boolean;
  showActions?: boolean;
  columns?: 1 | 2;
}

export function FormSkeleton({ 
  fields = 4, 
  showCard = true,
  showHeader = true,
  showActions = true,
  columns = 1
}: FormSkeletonProps) {
  const content = (
    <div className="animate-fade-in space-y-6">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}

      <div className={columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
        {Array.from({ length: fields }).map((_, i) => (
          <div key={`field-${i}`} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>

      {showActions && (
        <div className="flex justify-end gap-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className={columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
          {Array.from({ length: fields }).map((_, i) => (
            <div key={`field-${i}`} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
        {showActions && (
          <div className="flex justify-end gap-2 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
