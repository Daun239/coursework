import { useMemo } from "react";
import useScreeningData from "@/Features/Screenings/Hooks/UseScreeningData";
import { useCartStore } from "../Stores/CartState";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/Types/Ticket";
import { useScreeningPrice } from "../Hooks/useScreeningPrice";

const CartTicketPreview = ({ ticket }: { ticket: Ticket }) => {
    const { removeItem } = useCartStore();

    const { screeningPrice } = useScreeningPrice(ticket.screeningPriceId);

    const screeningId = screeningPrice?.screeningId;
    const { screeningData } = useScreeningData(screeningId ?? -1); // pass dummy ID or handle it better inside hook

    const seat = screeningData?.allSeats.find((s) => s.seatId === ticket.seatId);

    const highlightedSeat = useMemo(() => {
        if (!screeningData) return [];
        return screeningData.allSeats.filter((seat) => seat.seatId === ticket.seatId);
    }, [screeningData, ticket.seatId]);

    const handleRemoveTicket = () => {
        console.log(`removing ticket`);
        removeItem("ticket", ticket.ticketId);
    };

    if (!screeningPrice || !screeningData || !seat) return <p>Loading...</p>;

    return (
        <div className="space-y-4">
            <div className="mt-4 border p-3 rounded-md flex justify-between items-center">
                <div>
                    <p className="font-medium">
                        Row: {seat.rowNumber}, Seat: {seat.seatNumber}, Price: {screeningPrice.ticketPrice}₴, VIP:{" "}
                        <span className={seat.isVipCategory ? "text-purple-600 font-semibold" : "text-gray-500"}>
                            {seat.isVipCategory ? "Yes" : "No"}
                        </span>
                    </p>
                </div>
                <Button className="cursor-pointer" size="sm" variant="destructive" onClick={handleRemoveTicket}>
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default CartTicketPreview;
