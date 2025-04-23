import React, { useState, useRef } from "react";
import { Seat } from "../../../Types/Seat";
import SeatDataWindow from "./SeatDataWindow";

const SeatComponent: React.FC<{
    seat: Seat;
    isOccupied: boolean;
    isSelected: boolean;
    onSelectSeat: (seat: Seat) => void;
}> = ({ seat, isOccupied, isSelected, onSelectSeat }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);


    const bgColor = seat.isVipCategory
        ? isOccupied
            ? "bg-fuchsia-950"
            : isSelected
                ? "bg-fuchsia-600"
                : "bg-fuchsia-400"
        : isOccupied
            ? "bg-red-500"
            : isSelected
                ? "bg-blue-400"
                : "bg-green-400";

    const handleMouseEnter = () => {
        if (isOccupied) {
            console.log("Setting hover timeout...");
            hoverTimeout.current = setTimeout(() => {
                console.log("Hover timeout triggered");
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
            <button
                className={`w-10 h-10 border rounded flex items-center justify-center 
      ${isOccupied ? "bg-gray-400 cursor-not-allowed" : ""} 
      ${!isOccupied ? "cursor-pointer" : ""} 
      ${bgColor}`}
                disabled={isOccupied}
                onClick={() => !isOccupied && onSelectSeat(seat)}
            >
                {isOccupied ? "X" : `${seat.rowNumber}-${seat.seatNumber}`}
            </button>

            {isHovered && isOccupied && (
                <SeatDataWindow name="John" surname="Doe" />
            )}
        </td>

    );
};

export default SeatComponent;
