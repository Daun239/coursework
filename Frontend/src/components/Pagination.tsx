import { useLanguageStore } from '@/Stores/useLanguageStore';
import React, { useState, useEffect } from 'react';

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
    const [inputPage, setInputPage] = useState(currentPage); // Local state for the input field

    // Sync inputPage with currentPage when currentPage changes
    useEffect(() => {
        setInputPage(currentPage);
    }, [currentPage]);

    // Calculate if we can navigate to previous/next pages
    const canGoPrev = currentPage > 1; // Check if current page > 1
    const canGoNext = currentPage < totalPages; // Check if current page < totalPages

    const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and handle empty input
        if (value === '' || /^[1-9]\d*$/.test(value)) {
            setInputPage(Number(value));
        }
    };

    const handlePageSubmit = () => {
        // Only update if the page number is valid
        if (inputPage >= 1 && inputPage <= totalPages) {
            onPageChange(inputPage);
        } else {
            setInputPage(currentPage); // Revert if invalid
        }
    };


    const { language } = useLanguageStore(); // <-- use language from store

    const t = {
        en: {
            prev: "Prev",
            page: "Page",
            of: "of",
            next: "Next"
        },

        ua:
        {
            prev: "Назад",
            page: "Сторінка",
            of: "з",
            next: "Вперед"
        }
    };



    return (
        <div className={`flex items-center justify-between gap-2 mt-4 ${className}`}>
            {/* Prev Button */}
            <button
                className="btn btn-sm"
                disabled={!canGoPrev}
                onClick={() => onPageChange(currentPage - 1)}
            >
                {t[language].prev}
            </button>

            {/* Page Info with Input */}
            <div className="flex items-center gap-2">
                <span className="text-sm">
                </span>
                {t[language].page}
                <input
                    type="number"
                    value={inputPage}
                    onChange={handlePageInput}
                    onBlur={handlePageSubmit} // Submit on blur to confirm the page
                    className="w-16 text-center border p-1"
                    min="1"
                    max={totalPages}
                />



                <span>
                    {t[language].of}
                    <span className="ml-1">{totalPages}</span>
                </span>

            </div>

            {/* Next Button */}
            <button
                className="btn btn-sm"
                disabled={!canGoNext}
                onClick={() => onPageChange(currentPage + 1)}
            >
                {t[language].next}
            </button>
        </div>
    );
};

export default Pagination;
