import React, { useState, useRef, useEffect } from "react";
import { Seat } from "@/Types/Seat";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Client } from "@/Types/Client";

const SeatComponent: React.FC<{
    screeningId: number;
    seat: Seat;
    isOccupied: boolean;
    isSelected: boolean;
    onSelectSeat: (seat: Seat) => void;
}> = ({ screeningId, seat, isOccupied, isSelected, onSelectSeat }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { ticketService, checkService, checkTicketService, clientService } = useServiceStore();
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticket] = await ticketService.getAll(`screeningId = ${screeningId} and seatId = ${seat.seatId}`);

                if (!ticket) return; // If no ticket found, exit early

                const [checkTicket] = await checkTicketService.getAll(`ticketId = ${ticket.ticketId}`);

                if (!checkTicket) return; // If no check ticket found, exit early

                const [check] = await checkService.getAll(`checkId = ${checkTicket.checkId}`);

                if (!check) return; // If no check found, exit early

                const [client] = await clientService.getAll(`clientId = ${check.clientId}`);

                if (client) {
                    setClient(client); // Set client data
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isOccupied) {
            fetchData(); // Only fetch data for occupied seats
        }

    }, [screeningId, seat.seatId, isOccupied, ticketService, checkTicketService, checkService, clientService]);

    const bgColor = seat.isVipCategory
        ? isOccupied
            ? "bg-fuchsia-900" // Slightly purple for occupied VIP seats
            : isSelected
                ? "bg-fuchsia-600"
                : "bg-fuchsia-400"
        : isOccupied
            ? "bg-gray-500" // Normal gray for occupied seats
            : isSelected
                ? "bg-blue-400"
                : "bg-green-400";

    const handleMouseEnter = () => {
        if (isOccupied) {
            hoverTimeout.current = setTimeout(() => {
                setIsHovered(true);
            }, 500);
        }
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
        setIsHovered(false);
    };

    return (
        <td
            className="p-2 relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <HoverCard>
                <HoverCardTrigger>
                    <button
                        className={`w-10 h-10 border rounded flex items-center justify-center 
                          ${isOccupied ? "cursor-not-allowed" : ""} 
                          ${!isOccupied ? "cursor-pointer" : ""} 
                          ${bgColor}`}
                        disabled={isOccupied}
                        onClick={() => !isOccupied && onSelectSeat(seat)}
                    >
                        {isOccupied ? "X" : `${seat.rowNumber}-${seat.seatNumber}`}
                    </button>
                </HoverCardTrigger>
                {isHovered && isOccupied && client && (
                    <HoverCardContent>
                        Purchased by {`${client.name} ${client.surname}`}
                    </HoverCardContent>
                )}
            </HoverCard>
        </td>
    );
};

export default SeatComponent;
