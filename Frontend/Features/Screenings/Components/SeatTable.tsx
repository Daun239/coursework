import React from "react";
import { Seat } from "../../../Types/Seat";
import SeatColorLegend from "./SeatColorLegend";
import { all } from "axios";

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


    // const vipPrice = allSeats.find(s => s.isVipCategory = true).??? 

    const vipPrice = 100;
    const normalPrice = 50;

    return (
        <div className="inline-block p-8 bg-base-100 rounded-lg shadow-2xl">
            {/* SeatColorLegend */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <SeatColorLegend price={normalPrice} title="Normal" colors={[
                    { color: 'bg-red-500', label: 'Occupied' },
                    { color: 'bg-blue-400', label: 'Selected' },
                    { color: 'bg-green-400', label: 'Available' }
                ]} />
                <SeatColorLegend price={vipPrice} title="VIP" colors={[
                    { color: 'bg-fuchsia-950', label: 'Occupied' },
                    { color: 'bg-fuchsia-600', label: 'Selected' },
                    { color: 'bg-fuchsia-400', label: 'Available' }
                ]} />
            </div>

            <table className="border-collapse">
                <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => {
                                const seat = allSeats.find(s => s.rowNumber === rowIndex + 1 && s.seatNumber === colIndex + 1);
                                if (!seat) return <td key={colIndex}><div className="w-10 h-10" /></td>;

                                const occupied = isOccupied(seat.rowNumber, seat.seatNumber);
                                const selected = isSelected(seat.rowNumber, seat.seatNumber);
                                const vip = seat.isVipCategory;

                                const bgColor = vip
                                    ? occupied ? 'bg-fuchsia-950' : selected ? 'bg-fuchsia-600' : 'bg-fuchsia-400'
                                    : occupied ? 'bg-red-500' : selected ? 'bg-blue-400' : 'bg-green-400';

                                return (
                                    <td key={colIndex} className="p-2">
                                        <button
                                            className={`w-10 h-10 border rounded cursor-pointer ${bgColor}`}
                                            disabled={occupied}
                                            onClick={() => onSelectSeat(seat)}
                                        >
                                            {seat.rowNumber}-{seat.seatNumber}
                                        </button>
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

export default SeatTable