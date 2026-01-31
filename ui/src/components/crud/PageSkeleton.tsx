import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PageSkeletonProps {
  showHeader?: boolean;
  showCard?: boolean;
  children?: React.ReactNode;
}

export function PageSkeleton({ 
  showHeader = true, 
  showCard = true,
  children 
}: PageSkeletonProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {showCard ? (
        <Card>
          {showHeader && (
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </CardHeader>
          )}
          <CardContent className="p-0">
            {children}
          </CardContent>
        </Card>
      ) : (
        <>
          {showHeader && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          )}
          {children}
        </>
      )}
    </div>
  );
}
