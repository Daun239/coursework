import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}) => {
    // Calculate if we can navigate to previous/next pages
    const canGoPrev = currentPage > 1; // Check if current page > 1
    const canGoNext = currentPage < totalPages; // Check if current page < totalPages

    return (
        <div className={`flex items-center justify-between gap-2 mt-4 ${className}`}>
            {/* Prev Button */}
            <button
                className="btn btn-sm"
                disabled={!canGoPrev}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Prev
            </button>

            {/* Page Info */}
            <span className="text-sm">
                Page <strong>{currentPage}</strong> of {totalPages}
            </span>

            {/* Next Button */}
            <button
                className="btn btn-sm"
                disabled={!canGoNext}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
