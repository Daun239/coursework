import { Seat } from "../../../Types/Seat";
import SeatComponent from "./SeatComponent"; // Import the Seat component

const SeatTable: React.FC<{
    rows: number;
    columns: number;
    occupiedSeats?: Seat[];
    selectedSeats?: Seat[];
    allSeats: Seat[];
    onSelectSeat: (seat: Seat) => void;
}> = ({ allSeats, rows, columns, occupiedSeats = [], selectedSeats = [], onSelectSeat }) => {
    const isOccupied = (r: number, c: number) =>
        occupiedSeats.some(seat => seat.rowNumber === r && seat.seatNumber === c);

    const isSelected = (r: number, c: number) =>
        selectedSeats.some(seat => seat.rowNumber === r && seat.seatNumber === c);

    return (
        <div className="inline-block p-8 bg-base-100 rounded-lg shadow-2xl">
            <table className="border-collapse">
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => {
                                const seat = allSeats.find(
                                    s => s.rowNumber === rowIndex + 1 && s.seatNumber === colIndex + 1
                                );
                                if (!seat) return <td key={colIndex}><div className="w-10 h-10" /></td>;

                                const occupied = isOccupied(seat.rowNumber, seat.seatNumber);
                                const selected = isSelected(seat.rowNumber, seat.seatNumber);

                                return (
                                    <SeatComponent
                                        key={colIndex}
                                        seat={seat}
                                        isOccupied={occupied}
                                        isSelected={selected}
                                        onSelectSeat={onSelectSeat}
                                    />
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
