import React, { useState, useRef, useEffect } from "react";
import { Seat } from "@/Types/Seat";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Client } from "@/Types/Client";

const NormalSeatComponent: React.FC<{
    screeningId: number;
    seat: Seat;
    isOccupied: boolean;
    isSelected: boolean;
    isPurchased: boolean;
    onSelectSeat: (seat: Seat) => void;
}> = ({ screeningId, seat, isOccupied, isSelected, isPurchased, onSelectSeat }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { ticketService, checkService, checkTicketService, clientService } = useServiceStore();
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticket] = await ticketService.getAll(`screeningId = ${screeningId} and seatId = ${seat.seatId}`);
                if (!ticket) return;

                const [checkTicket] = await checkTicketService.getAll(`ticketId = ${ticket.ticketId}`);
                if (!checkTicket) return;

                const [check] = await checkService.getAll(`checkId = ${checkTicket.checkId}`);
                if (!check) return;

                const [client] = await clientService.getAll(`clientId = ${check.clientId}`);
                if (client) setClient(client);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isOccupied) fetchData();
    }, [screeningId, seat.seatId, isOccupied, ticketService, checkTicketService, checkService, clientService]);

    let bgColor: string;

    if (seat.isVipCategory) {
        if (isOccupied) bgColor = "dark:bg-fuchsia-800 bg-fuchsia-600";
        else if (isSelected) bgColor = "bg-fuchsia-400 dark:bg-fuchsia-700";
        else bgColor = "bg-fuchsia-200 dark:bg-fuchsia-500";
    } else {
        if (isOccupied) bgColor = "bg-gray-300 dark:bg-gray-500";
        else if (isSelected) bgColor = "bg-blue-400";
        else if (isPurchased) bgColor = "bg-yellow-400";
        else bgColor = "bg-green-400 dark:bg-green-600";
    }

    const handleMouseEnter = () => {
        if (isOccupied) {
            hoverTimeout.current = setTimeout(() => setIsHovered(true), 500);
        }
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setIsHovered(false);
    };

    return (
        <td className="p-2 relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <HoverCard>
                <HoverCardTrigger>
                    <button
                        className={`w-10 h-10 border rounded flex items-center justify-center rounded-md 
                            ${isOccupied ? "cursor-not-allowed" : "cursor-pointer"} ${bgColor}`}
                        disabled={isOccupied}
                        onClick={() => !isOccupied && onSelectSeat(seat)}
                    >
                        {isOccupied ? "X" : `${seat.rowNumber}-${seat.seatNumber}`}
                    </button>
                </HoverCardTrigger>
                {isHovered && isOccupied && client && (
                    <HoverCardContent>
                        Purchased by {client.name} {client.surname}
                    </HoverCardContent>
                )}
            </HoverCard>
        </td>
    );
};

export default NormalSeatComponent;
