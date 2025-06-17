import React from 'react';
import { IoClose } from 'react-icons/io5';

export const Modal = ({
    title,
    content,
    onClose,
    onSubmit
}) => {
    return (
        <div className="fadeInTop w-fit h-fit min-w-52 md:min-w-[400px] max-w-lg mx-4 fixed left-1/2 z-[100] translate-x-[-50%] ">
            <div className="relative rounded-2xl bg-white dark:bg-gray-800 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                    {content}
                </div>

                {/* Footer */}
                {onSubmit && (
                    <div className="flex justify-end gap-3 px-6 py-4 border-t dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSubmit}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


