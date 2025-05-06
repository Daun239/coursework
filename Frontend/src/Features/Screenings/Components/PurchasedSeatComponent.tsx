import React, { useState } from "react";
import { Seat } from "@/Types/Seat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCartStore } from "@/Features/Cart/Stores/CartState";

const PurchasedSeatComponent: React.FC<{
    screeningId: number;
    seat: Seat;
    onSelectSeat: (seat: Seat) => void;
    handleFilterSelected: (seat: Seat) => void;
    handleFilter: () => void;
}> = ({ seat, screeningId, handleFilter, handleFilterSelected }) => {

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [open, setOpen] = useState(false); // Control popover open state

    const { cart, removeItem } = useCartStore();
    const ticketsInCart = cart.ticket;

    const ticket = ticketsInCart.find(t => t.seatId === seat.seatId && t.screeningId === screeningId);

    const handleRemoveTicket = () => {
        removeItem('ticket', ticket.ticketId);
        handleFilterSelected(seat);
    }

    // Translations for text content
    const translations = {
        en: {
            removeConfirm: "Are you sure you want to remove this seat from the cart?",
            cancel: "Cancel",
            remove: "Remove",
        },
        ua: {
            removeConfirm: "Ви впевнені, що хочете видалити це місце з кошика?",
            cancel: "Скасувати",
            remove: "Видалити",
        },
    };

    // Assume language is coming from context or props, default to 'en'
    const language = "ua"; // For example, 'ua'
    const t = translations[language] ?? translations["en"];

    return (
        <td className="p-2 relative z-[1000]">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setOpen(true)}
                        className="w-10 h-10 rounded rounded-md border flex items-center justify-center cursor-pointer hover:bg-red-500 bg-yellow-700"
                    >
                        {isHovered ? "X" : `${seat.rowNumber}-${seat.seatNumber}`}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="p-5 w-72 shadow-xl">
                    <div className="space-y-4">
                        <div className="font-medium">
                            {t.removeConfirm}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setOpen(false)} // Closes popover
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md transition hover:bg-gray-300 font-medium text-sm cursor-pointer"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={() => {
                                    handleRemoveTicket(); // your removal logic
                                    setOpen(false); // Close after removing too
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-md transition hover:bg-red-600 font-medium text-sm cursor-pointer"
                            >
                                {t.remove}
                            </button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </td>
    );
};

export default PurchasedSeatComponent;
