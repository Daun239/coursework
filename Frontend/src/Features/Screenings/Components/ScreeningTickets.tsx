import React, { useState } from "react";
import { useCartStore } from "../../Cart/Stores/CartState";
import SeatColorLegend from "./SeatColorLegend";
import SeatTable from "./SeatTable";
import { useServiceStore } from "../../../Stores/ServicesStore";
import useScreeningData from "../Hooks/UseScreeningData";
import { Seat } from "@/Types/Seat";
import { Ticket } from "@/Types/Ticket";
import { toast } from "sonner"
import { useLanguageStore } from "@/Stores/useLanguageStore";


interface ScreeningTicketsProps {
  id: number;
  theme?: 'dark' | 'light';
}




const t = {
  en: {
    errorLoadingScreeningData: "Error loading screening data. Please try again.",
    invalidScreeningData: "Invalid screening data format. Please try again.",
    screeningDetails: "Screening Details",

    movie: "🎬 Movie",
    language: "Language",
    screeningFormat: "Screening Format",
    hallTechnology: "Hall Technology",
    hallNumber: "🏛 Hall Number",
    showTime: "Show Time",
    selectSeats: "Select Seats",
    seatDataNotAvailable: "Seat data not available",
    yourSelection: "Your selection",
    selectedSeats: "Selected Seats:",
    row: "Row",
    seat: "Seat",
    total: "Total",
    noSeats: "No seats selected",
    addToCart: "Add to cart",
    loadingScreeningData: "Loading screening data...",
    toast: "Tickets added to cart successfully!",


  },
  ua: {
    errorLoadingScreeningData: "Помилка завантаження даних сеансу. Спробуйте ще раз.",
    invalidScreeningData: "Неправильний формат даних сеансу. Спробуйте ще раз.",
    screeningDetails: "Деталі сеансу",
    movie: "🎬 Фільм",
    language: "Мова",
    screeningFormat: "Формат сеансу",
    hallTechnology: "Технологія залу",
    hallNumber: "🏛 Номер залу",
    showTime: "Час показу",
    selectSeats: "Оберіть місця",
    seatDataNotAvailable: "Дані про місця недоступні",
    yourSelection: "Ваш вибір",
    selectedSeats: "Обрані місця:",
    row: "Ряд",
    seat: "Місце",
    total: "Всього",
    noSeats: "Місця не обрані",
    addToCart: "Додати до кошика",
    loadingScreeningData: "Завантаження даних сеансу...",
    toast: "Квитки успішно додані до кошика!"
  }

}

const ScreeningTickets: React.FC<ScreeningTicketsProps> = ({ id, theme = 'light' }) => {


  const language1 = useLanguageStore().language;
  const languagetranslated = t[language1];


  // Wrapping the hook in a try-catch to handle any potential errors
  let screeningDataResult;
  try {
    screeningDataResult = useScreeningData(id);
  } catch (error) {
    console.error("Error loading screening data:", error);
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-300">
        <div className="flex flex-col items-center">
          <p>{languagetranslated.errorLoadingScreeningData}</p>
        </div>
      </div>
    );
  }

  // Check if screeningDataResult is undefined or not an object
  if (!screeningDataResult || typeof screeningDataResult !== 'object') {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-300">
        <div className="flex flex-col items-center">
          <p>{languagetranslated.invalidScreeningData}</p>
        </div>
      </div>
    );
  }

  const {
    screeningData,
    selectedSeats,
    occupiedSeats,
    purchasedSeats,
    hall,
    screeningPrices,
    language,
    hallTechnology,
    screeningFormat,
    setSelectedSeats,
  } = screeningDataResult;

  const { addItem, cart } = useCartStore();
  const { ticketService } = useServiceStore();

  const [ticketPrices, setTicketPrices] = useState<number[]>([]);

  const totalPrice = selectedSeats?.reduce((sum, seat) =>
    sum + (seat.isVipCategory ? 100 : 50), 0) || 0;



  const handleClear = () => {
    selectedSeats.length = 0;
  }

  const handleFilterSelected = (seat: Seat) => {
    setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
  };

  const handleAddToCart = async () => {
    if (!selectedSeats || selectedSeats.length === 0) return;

    try {
      const ticketsResult = await ticketService.getAll("", "number desc", 1, 1);
      if (!ticketsResult || !ticketsResult[0]) {
        throw new Error("Could not retrieve ticket information");
      }

      const { number } = ticketsResult[0];

      const ticketsInCart = cart.ticket;

      selectedSeats.forEach((seat, index) => {
        const ticket: Ticket = {
          price: seat.isVipCategory ? 100 : 50,
          seatId: seat.seatId,
          screeningId: id,
          number: number + index + 1 + ticketsInCart.length,
          ticketId: ticketsInCart.length + index,
        };


        addItem("ticket", ticket);
      });


      handleClear();
      toast.success('Tickets added to cart successfully!')

    } catch (error) {
      console.error("Failed to add tickets:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (!setSelectedSeats || !selectedSeats) return;

    setSelectedSeats((prev) =>
      prev.some((s) => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber)
        ? prev.filter((s) => !(s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber))
        : [...prev, seat]
    );
  };

  // Return the actual JSX
  return (
    <div className={`p-6 rounded-2xl shadow-lg dark:bg-gray-800 dark:text-gray-100 bg-white text-gray-800`}>
      <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700 dark:text-white">
        {languagetranslated.screeningDetails}
      </h2>

      {screeningData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
            {[
              { label: languagetranslated.movie, value: screeningData.movieTitle },
              { label: languagetranslated.language, value: language?.language1 },
              { label: languagetranslated.screeningFormat, value: screeningFormat?.screeningFormat1 },
              { label: languagetranslated.hallTechnology, value: hallTechnology?.hallTechnology1 },
              { label: languagetranslated.hallNumber, value: hall?.hallNumber },
              {
                label: languagetranslated.showTime,
                value: `📅 ${new Date(screeningData.startDate).toLocaleDateString()} 🕒 ${screeningData?.startTime.slice(0, 5)} - ${screeningData?.endTime.slice(0, 5)}`
              },
            ].map(({ label, value }, index) => (
              <div key={index} className="flex flex-col space-y-0.5">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
                <span className="text-sm text-gray-800 dark:text-white">{value || 'N/A'}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{languagetranslated.selectSeats}</h3>

              <div className="ml-8 my-4">
                <SeatColorLegend title="Pricing" price={screeningPrices[0]} priceVip={screeningPrices[1]} />
              </div>

              <div className="flex justify-center">
                {screeningData.rows && screeningData.columns && screeningData.allSeats ? (
                  <SeatTable
                    screeningId={id}
                    rows={screeningData.rows}
                    columns={screeningData.columns}
                    occupiedSeats={screeningData.occupiedSeats || []}
                    selectedSeats={selectedSeats || []}
                    purchasedSeats={purchasedSeats}
                    onSelectSeat={handleSeatClick}
                    allSeats={screeningData.allSeats}
                    handleClear={handleClear}
                    handleFilterSelected={handleFilterSelected}
                  />
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    {languagetranslated.seatDataNotAvailable}
                  </p>
                )}
              </div>
            </div>

            <div className="md:w-64">
              <div className="p-4 rounded-xl shadow-md bg-gray-100 dark:bg-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{languagetranslated.yourSelection}</h3>

                {selectedSeats && selectedSeats.length > 0 ? (
                  <>
                    <div className="mb-4 text-gray-600 dark:text-gray-300">
                      <p className="mb-2">{languagetranslated.selectedSeats} {selectedSeats.length}</p>
                      <div className="text-xs space-y-1">
                        {selectedSeats.map((seat) => (
                          <div key={`${seat.rowNumber}-${seat.seatNumber}`} className="flex justify-between">
                            <span>{languagetranslated.row} {String.fromCharCode(64 + seat.rowNumber)}, {languagetranslated.seat} {seat.seatNumber}</span>
                            <span>${seat.isVipCategory ? 100 : 50}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="py-2 border-t font-semibold flex justify-between border-gray-300 dark:border-gray-600">
                      <span>{languagetranslated.total}:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    {languagetranslated.noSeats}
                  </p>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSeats || selectedSeats.length === 0}
                  className={`mt-4 rounded-xl p-3 w-full transition-all duration-300 ${!selectedSeats || selectedSeats.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                    : "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                    }`}
                >
                  {languagetranslated.addToCart}
                </button>
              </div >
            </div >
          </div >
        </>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-600 dark:text-gray-300">
          <div className="flex flex-col items-center">
            <p>{languagetranslated.loadingScreeningData}</p>
          </div>
        </div>
      )}
    </div>
  );


};

export default ScreeningTickets;