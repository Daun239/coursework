import { useMemo } from "react";
import useScreeningData from "@/Features/Screenings/Hooks/UseScreeningData";
import { useCartStore } from "../Stores/CartState";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/Types/Ticket";

const CartTicketPreview = ({ ticket }: { ticket: Ticket }) => {
    const { screeningData } = useScreeningData(ticket.screeningId);

    const { removeItem } = useCartStore();


    const handleRemoveTicket = () => {
        console.log(`removign ticket`)
        removeItem('ticket', ticket.ticketId);
    }



    const highlightedSeat = useMemo(() => {
        if (!screeningData) return [];
        return screeningData.allSeats.filter(seat => seat.seatId === ticket.seatId);
    }, [screeningData, ticket.seatId]);

    const seat = screeningData?.allSeats.find(s => s.seatId === ticket.seatId);

    // console.log('SEAT IN CART TICKET', seat);

    if (!screeningData || !seat) return <p>Loading...</p>;

    return (
        <div className="space-y-4">

            {/* Commented out SeatTable and just displaying seat info */}


            <div className="mt-4 border p-3 rounded-md flex justify-between items-center">
                <div>
                    <p className="font-medium">
                        Row: {seat.rowNumber}, Seat: {seat.seatNumber}, Price: {ticket.price}₴, VIP:{" "}
                        <span className={seat.isVipCategory ? "text-purple-600 font-semibold" : "text-gray-500"}>
                            {seat.isVipCategory ? "Yes" : "No"}
                        </span>
                    </p>


                </div>
                <Button
                    className="cursor-pointer"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveTicket()}

                >
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default CartTicketPreview;
