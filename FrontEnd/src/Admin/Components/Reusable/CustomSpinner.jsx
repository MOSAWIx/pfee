import React from 'react';

function CustomSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-spin"></div>
                {/* Inner ring */}
                <div className="w-16 h-16 border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin absolute top-0 left-0"></div>
                {/* Center dot */}
                <div className="w-4 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full absolute top-6 left-6"></div>
            </div>
            <span className="ml-4 text-lg font-medium text-indigo-600 dark:text-indigo-400">Loading...</span>
        </div>
    );
}

export default CustomSpinner; 