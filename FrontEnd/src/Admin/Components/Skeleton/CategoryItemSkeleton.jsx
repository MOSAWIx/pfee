import React from 'react'

function CategoryItemSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    {/* Title Skeleton */}
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>

                    {/* Parent Category Skeleton */}
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2"></div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Status Badge Skeleton */}
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

                    {/* Edit Button Skeleton */}
                    <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        </div>
    )
}

export {CategoryItemSkeleton}