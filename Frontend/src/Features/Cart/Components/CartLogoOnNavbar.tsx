import React, { useRef, useEffect, useState } from 'react';
import CartModalComponent from './CartModalComponent';
import { useCartTotals } from "../Hooks/useCartTotal";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const CartLogoOnNavbar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const modalRef = useRef<HTMLDialogElement>(null);
    const {
        productsTotalQuantity,
        productsTotalPrice,
        ticketsTotalQuantity,
        ticketsTotalPrice,
        totalItems,
    } = useCartTotals();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "c" && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault();
                setIsOpen(prevState => !prevState);
            }
            else if (e.key === 'Escape') {
                modalRef.current?.close();
            }

        };

        document.addEventListener("keydown", down);

        return () => {
            document.removeEventListener("keydown", down);
        };
    }, []);


    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.showModal();
            document.body.style.overflow = "";  // Disable scroll when modal is open
        } else if (modalRef.current) {
            modalRef.current.close();
            document.body.style.overflow = "auto";  // Re-enable scroll when modal is closed
        }
    }, [isOpen]); // Dependency on isOpen ensures the modal is only toggled when isOpen changes


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="btn btn-ghost btn-circle relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 
                                1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 
                                0 2 2 0 014 0z"
                            />
                        </svg>
                        {totalItems > 0 && (
                            <span className="badge-sm indicator-item text-black dark:text-white absolute -top-1 -right-1">
                                {totalItems}
                            </span>
                        )}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 p-4">
                    <DropdownMenuLabel className="text-base font-semibold mb-2">
                        Your Cart
                    </DropdownMenuLabel>

                    <div className="flex flex-col gap-2 mb-3">
                        <div className="flex justify-between text-info">
                            <span className="font-medium">{ticketsTotalQuantity} tickets</span>
                            <span className="font-semibold">{ticketsTotalPrice}₴</span>
                        </div>
                        <div className="flex justify-between text-info">
                            <span className="font-medium">{productsTotalQuantity} products</span>
                            <span className="font-semibold">{productsTotalPrice}₴</span>
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    <div className="pt-2">
                        <button
                            onClick={() => modalRef.current?.showModal()}
                            className="btn btn-primary btn-block btn-sm"
                        >
                            View cart
                        </button>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <CartModalComponent ref={modalRef} />
        </>
    );
};

export default CartLogoOnNavbar;
