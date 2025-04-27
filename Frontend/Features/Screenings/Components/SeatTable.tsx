import React from "react";
import { Seat } from "../../../Types/Seat";
import SeatComponent from "./SeatComponent";
import { useEffect } from "react";

const SeatTable: React.FC<{
    rows: number;
    columns: number;
    occupiedSeats?: Seat[];
    selectedSeats?: Seat[];
    allSeats: Seat[];
    onSelectSeat: (seat: Seat) => void;
}> = ({ allSeats, rows, columns, occupiedSeats = [], selectedSeats = [], onSelectSeat }) => {

    // Debug logging
    useEffect(() => {
        console.log("SeatTable render:");
        console.log(`Total seats: ${allSeats.length}`);
        console.log(`Occupied seats: ${occupiedSeats.length}`);
        console.log(`Selected seats: ${selectedSeats.length}`);

        // Log some sample occupied seat IDs for debugging
        if (occupiedSeats.length > 0) {
            console.log("Sample occupied seats:",
                occupiedSeats.slice(0, 3).map(s => ({
                    seatId: s.seatId,
                    row: s.rowNumber,
                    seat: s.seatNumber
                }))
            );
        }
    }, [allSeats, occupiedSeats, selectedSeats]);

    // Check if a seat is occupied by comparing seatId
    const isOccupied = (seat: Seat) =>
        occupiedSeats.some(occSeat => occSeat.seatId === seat.seatId);

    // Check if a seat is selected
    const isSelected = (seat: Seat) =>
        selectedSeats.some(selSeat =>
            selSeat.seatId === seat.seatId
        );

    return (
        <div className="inline-block p-8 bg-base-100 rounded-lg shadow-2xl max-w-full overflow-x-auto">
            <table className="border-collapse">
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => {
                                const rowNumber = rowIndex + 1;
                                const seatNumber = colIndex + 1;

                                const seat = allSeats.find(
                                    s => s.rowNumber === rowNumber && s.seatNumber === seatNumber
                                );

                                if (!seat) return <td key={colIndex}><div className="w-10 h-10" /></td>;

                                const occupied = isOccupied(seat);
                                const selected = isSelected(seat);

                                return (
                                    <td key={colIndex}>
                                        <SeatComponent
                                            seat={seat}
                                            isOccupied={occupied}
                                            isSelected={selected}
                                            onSelectSeat={onSelectSeat}
                                        />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SeatTable;