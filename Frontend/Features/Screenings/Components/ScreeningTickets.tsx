import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useServiceStore } from "../../../Stores/ServicesStore";
import { Seat } from "../../../Types/Seat";
import { Hall } from '../../../Types/Hall';
import { Screening } from '../../../Types/Screening';
import { HallTechnology } from '../../../Types/HallTechnology';
import { Language } from '../../../Types/Language';
import formFilterQuery from '../../../Lib/formFilterQuery';
import SeatTable from "./SeatTable"
import { ScreeningFormat } from '../../../Types/ScreeningFormat';





const ScreeningTickets: React.FC = () => {
  const { id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<Seat[]>([]);
  const [hall, setHall] = useState<Hall | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [screeningData, setScreeningData] = useState<any>(null);
  const [language, setLanguage] = useState<Language>();
  const [HallTechnology, setHallTechnology] = useState<HallTechnology>();
  const [screening, setScreening] = useState<Screening>();
  const [screeningFormat, setScreeningFormat] = useState<ScreeningFormat>();


  const { screeningFormatService, hallTechnologyService, languageService, screeningService, hallService, seatService, ticketService } = useServiceStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [screening] = await screeningService.getAll(`screeningId = ${id}`);
        setScreening(screening);
        const [fetchedHall] = await hallService.getAll(`hallId = ${screening.hallId}`, '');
        setHall(fetchedHall);

        const allSeats = await seatService.getAll(`hallId = ${fetchedHall.hallId}`, '', 1, 1000);
        setSeats(allSeats);

        const ticketsQuery = formFilterQuery({
          field: 'screeningId',
          operator: 'in',
          values: [parseInt(id)]
        });

        const tickets = await ticketService.getAll(ticketsQuery, '', 1, 100000);
        const occupiedSeatIds = new Set(tickets.map(t => t.seatId));
        const occupied = allSeats.filter(seat => occupiedSeatIds.has(seat.seatId));
        setOccupiedSeats(occupied);

        const rows = Math.max(...allSeats.map(s => s.rowNumber), 1);
        const columns = Math.max(...allSeats.map(s => s.seatNumber), 1);

        const [hallTechnology] = await hallTechnologyService.getAll(`hallTechnologyId = ${fetchedHall?.hallTechnologyId}`);
        setHallTechnology(hallTechnology);

        const [language] = await languageService.getAll(`languageId = ${screening.languageId}`);
        setLanguage(language);

        const [screeningFormat] = await screeningFormatService.getAll(`screeningFormatId = ${screening.screeningFormatId}`);
        setScreeningFormat(screeningFormat)

        setScreeningData({
          movieTitle: "Movie Title",
          date: new Date().toLocaleDateString(),
          availableTickets: allSeats.length - occupied.length,
          rows,
          columns,
          occupiedSeats: occupied,
          allSeats
        });
      } catch (err) {
        console.error("Error loading screening data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeats(prev =>
      prev.some(s => s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber)
        ? prev.filter(s => !(s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber))
        : [...prev, seat]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Screening Tickets for ID: {id}</h2>

      {screeningData ? (
        <>
          <p><strong>Movie:</strong> {screeningData.movieTitle}</p>
          <p><strong>Date:</strong> {screeningData.date}</p>
          <p><strong>Language:</strong> {language?.language1}</p>
          <p><strong>ScreeningFormat</strong> {screeningFormat?.screeningFormat1}</p>
          <p><strong>Hall technology</strong> {HallTechnology?.hallTechnology1}</p>
          <p><strong>Starts:</strong> {`${screening?.startDate}, ${screening?.startTime}`}</p>

          <p><strong>Ends:</strong> {
            (() => {
              if (!screening) return null;

              const startDateTime = new Date(`${screening.startDate}T${screening.startTime}`);
              const endDateTime = new Date(`${screening.startDate}T${screening.endTime}`);

              // If end time is before start time (e.g., starts at 22:00, ends at 01:00)
              if (endDateTime <= startDateTime) {
                endDateTime.setDate(endDateTime.getDate() + 1); // move to next day
              }

              return `${endDateTime.toLocaleDateString()}, ${screening.endTime}`;
            })()
          }</p>



          <h3 className="mt-6 mb-2 font-semibold ">Select Seats:</h3>
          <SeatTable
            rows={screeningData.rows}
            columns={screeningData.columns}
            occupiedSeats={screeningData.occupiedSeats}
            selectedSeats={selectedSeats}
            onSelectSeat={handleSeatClick}
            allSeats={screeningData.allSeats}
          />
        </>
      ) : (
        <p>Loading screening data...</p>
      )}
    </div>
  );
};

export default ScreeningTickets;
