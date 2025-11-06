import React from "react";

const CategoryCardSkeleton = () => {
    return (
        <div className="breathing-card bg-card border border-border rounded-xl p-6 animate-pulse">
            {/* Category Header Skeleton */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div>
                        <div className="h-5 bg-muted rounded w-32 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <div className="w-8 h-8 bg-muted rounded"></div>
                    <div className="w-8 h-8 bg-muted rounded"></div>
                </div>
            </div>

            {/* Category Stats Skeleton */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="w-full bg-muted rounded-full h-2"></div>
                <div className="flex items-center justify-between">
                    <div className="h-4 bg-muted rounded w-16"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                </div>
            </div>

            {/* Recent Items Preview Skeleton */}
            <div className="mt-4 pt-4 border-t border-border">
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="flex flex-wrap gap-1">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-6 bg-muted rounded w-20"></div>
                    <div className="h-6 bg-muted rounded w-14"></div>
                </div>
            </div>
        </div>
    );
};

export default CategoryCardSkeleton;
