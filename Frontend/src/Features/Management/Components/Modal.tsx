import React from "react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};
import { X } from "lucide-react"

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="dark:bg-gray-800 bg-white rounded-lg w-[90%] max-w-6xl max-h-[90vh] overflow-y-auto relative p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black dark:text-white p-2 rounded-full hover:text-red-400 cursor-pointer"
                >
                    <X />
                </button>


                <div className="w-full flex flex-col items-center justify-center">
                    {children}
                </div>
            </div>
        </div>
    );

};
