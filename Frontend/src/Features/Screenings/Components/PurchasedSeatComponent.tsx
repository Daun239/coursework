import React, { useState, useEffect } from "react";
import { Seat } from "@/Types/Seat";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCartStore } from "@/Features/Cart/Stores/CartState";
import { ScreeningPrice } from "@/Types/ScreeningPrice"; // Make sure to import the type
import { useServiceStore } from "@/Stores/ServicesStore";

const PurchasedSeatComponent: React.FC<{
    screeningId: number;
    seat: Seat;
    onSelectSeat?: (seat: Seat) => void;
    handleFilterSelected: (seat: Seat) => void;
    handleFilter: () => void;
    language?: string;
}> = ({ seat, screeningId, handleFilter, handleFilterSelected, language = "ua" }) => {

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [screeningPrices, setScreeningPrices] = useState<ScreeningPrice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { cart, removeItem } = useCartStore();
    const { screeningPriceService } = useServiceStore();
    const ticketsInCart = cart.ticket;

    // Fetch screening prices on component mount
    useEffect(() => {
        const fetchScreeningPrices = async () => {
            try {
                setIsLoading(true);
                const prices = await screeningPriceService.getAll(`screeningId = ${screeningId}`);
                setScreeningPrices(prices);
            } catch (error) {
                console.error("Failed to fetch screening prices:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScreeningPrices();
    }, [screeningId, screeningPriceService]);

    // Find the ticket in cart for this seat
    const ticket = React.useMemo(() => {
        if (!screeningPrices.length || !ticketsInCart.length) return null;

        // Get an array of all screeningPriceIds
        const screeningPriceIds = screeningPrices.map(sp => sp.screeningPriceId);

        // Find the ticket where the seatId matches and the screeningPriceId is in the list
        return ticketsInCart.find(
            t => t.seatId === seat.seatId && screeningPriceIds.includes(t.screeningPriceId)
        );
    }, [screeningPrices, ticketsInCart, seat.seatId]);

    const handleRemoveTicket = () => {
        if (!ticket) return;

        removeItem('ticket', ticket.ticketId);
        handleFilterSelected(seat);
        handleFilter(); // Optional: refresh filtering after removal
    };

    // Translations for text content
    const translations = {
        en: {
            removeConfirm: "Are you sure you want to remove this seat from the cart?",
            cancel: "Cancel",
            remove: "Remove",
            loading: "Loading..."
        },
        ua: {
            removeConfirm: "Ви впевнені, що хочете видалити це місце з кошика?",
            cancel: "Скасувати",
            remove: "Видалити",
            loading: "Завантаження..."
        },
    };

    const t = translations[language as keyof typeof translations] ?? translations["en"];

    if (isLoading) {
        return (
            <td className="p-2">
                <div className="w-10 h-10 rounded-md border flex items-center justify-center bg-gray-300">
                    {t.loading}
                </div>
            </td>
        );
    }

    return (
        <td className="p-2 relative z-[1000]">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer hover:bg-red-500 bg-yellow-700 text-white"
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
                                type="button"
                                onClick={() => setOpen(false)} // Closes popover
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md transition hover:bg-gray-300 font-medium text-sm cursor-pointer"
                            >
                                {t.cancel}
                            </button>
                            <button
                                type="button"
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