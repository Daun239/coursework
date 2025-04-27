import React from "react";
import { useCartStore } from "../../Cart/Stores/CartState";
import { toast } from "react-toastify";
import SeatColorLegend from "./SeatColorLegend";
import SeatTable from "./SeatTable";
import useScreeningData from "../Hooks/useScreeningData";
import { useServiceStore } from "../../../Stores/ServicesStore";
import { Ticket } from "../../../Types/Ticket";

// Define the props interface
interface ScreeningTicketsProps {
  id: number; // Add id prop as a number
}

const ScreeningTickets: React.FC<ScreeningTicketsProps> = ({ id }) => {
  const {
    screeningData,
    selectedSeats,
    occupiedSeats,
    hall,
    language,
    hallTechnology,
    screeningFormat,
    setSelectedSeats,
  } = useScreeningData(id);

  const { addItem } = useCartStore();
  const { ticketService } = useServiceStore();

  const handleAddToCart = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const [{ number }] = await ticketService.getAll("", "number desc", 1, 1);

      selectedSeats.forEach((seat, index) => {
        const ticket: Ticket = {
          price: seat.isVipCategory ? 100 : 50,
          seatId: seat.seatId,
          screeningId: id,
          number: number + index + 1,
          ticketId: 0,
        };

        console.log('added ticket', ticket);

        addItem("ticket", ticket); // pass the ticket, not just seat
      });

      toast.success("Tickets added to cart!");
    } catch (error) {
      console.error("Failed to add tickets:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeats((prev) =>
      prev.some(
        (s) => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber
      )
        ? prev.filter(
          (s) => !(s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber)
        )
        : [...prev, seat]
    );
  };

  return (
    <div className="p-4 bg-gray-700">
      <h2 className="text-xl font-bold mb-4">Screening Tickets for ID: {id}</h2>


      {screeningData ? (
        <>
          <p>
            <strong>Movie:</strong> {screeningData.movieTitle}
          </p>
          <p>
            <strong>Date:</strong> {screeningData.date}
          </p>
          <p>
            <strong>Language:</strong> {language?.language1}
          </p>
          <p>
            <strong>Screening Format:</strong> {screeningFormat?.screeningFormat1}
          </p>
          <p>
            <strong>Hall technology:</strong> {hallTechnology?.hallTechnology1}
          </p>
          <p>
            <strong>Starts:</strong> {`${screeningData.startDate}, ${screeningData.startTime}`}
          </p>

          {/* <h3 className="mt-6 mb-2 font-semibold">Select Seats:</h3> */}
          {/* SeatColorLegend in the top-right corner */}
          <div className="absolute top-4 left-2">
            <SeatColorLegend
              title="Seat Types"
              price={50}
              priceVip={100}
            />

            <h2>Hall number</h2>
            <h2>Language</h2>
            <h2>HallTechnology</h2>
            <h2></h2>
          </div>

          <SeatTable
            rows={screeningData.rows}
            columns={screeningData.columns}
            occupiedSeats={screeningData.occupiedSeats}
            selectedSeats={selectedSeats}
            onSelectSeat={handleSeatClick}
            allSeats={screeningData.allSeats}
          />

          <div>

            <button
              onClick={handleAddToCart}
              className={`rounded-xl p-1.5 btn btn-ghost ${selectedSeats.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-900 text-white"
                }`}
              disabled={selectedSeats.length === 0}
            >
              Add to cart
            </button>

          </div>
        </>
      ) : (
        <p>Loading screening data...</p>
      )}
    </div>
  );
};

export default ScreeningTickets;
