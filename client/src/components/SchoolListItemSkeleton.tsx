import { Skeleton } from '@/components/ui/skeleton';

export default function SchoolListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      {/* Checkbox skeleton */}
      <Skeleton className="h-4 w-4 rounded" />
      
      <div className="flex-1 min-w-0">
        {/* School name skeleton */}
        <Skeleton className="h-4 w-48 mb-2" />
        
        {/* Location and gender skeleton */}
        <div className="flex items-center gap-2 mt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Badges skeleton */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      
      {/* Chevron skeleton */}
      <Skeleton className="h-4 w-4 rounded" />
    </div>
  );
}



