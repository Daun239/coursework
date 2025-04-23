import { useState, useEffect } from "react";
import { useServiceStore } from "../../../Stores/ServicesStore";
import formFilterQuery from "../../../Lib/formFilterQuery";
import { Language } from "../../../Types/Language";
import { ScreeningFormat } from "../../../Types/ScreeningFormat";
import { HallTechnology } from "../../../Types/HallTechnology";
import { Seat } from "../../../Types/Seat";
import { Hall } from "../../../Types/Hall";

const useScreeningData = (id: string | undefined) => {
  const [screeningData, setScreeningData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<Seat[]>([]);
  const [hall, setHall] = useState<Hall | null>(null);
  const [language, setLanguage] = useState<Language>();
  const [hallTechnology, setHallTechnology] = useState<HallTechnology>();
  const [screeningFormat, setScreeningFormat] = useState<ScreeningFormat>();

  const {
    screeningFormatService,
    hallTechnologyService,
    languageService,
    screeningService,
    hallService,
    seatService,
    ticketService,
  } = useServiceStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const [screening] = await screeningService.getAll(
          `screeningId = ${id}`
        );
        const [fetchedHall] = await hallService.getAll(
          `hallId = ${screening.hallId}`,
          ""
        );
        const allSeats = await seatService.getAll(
          `hallId = ${fetchedHall.hallId}`,
          "",
          1,
          1000
        );
        const ticketsQuery = formFilterQuery({
          field: "screeningId",
          operator: "in",
          values: [parseInt(id)],
        });

        const tickets = await ticketService.getAll(ticketsQuery, "", 1, 100000);
        const occupiedSeatIds = new Set(tickets.map((t) => t.seatId));
        const occupied = allSeats.filter((seat) =>
          occupiedSeatIds.has(seat.seatId)
        );

        const rows = Math.max(...allSeats.map((s) => s.rowNumber), 1);
        const columns = Math.max(...allSeats.map((s) => s.seatNumber), 1);

        const [fetchedHallTechnology] = await hallTechnologyService.getAll(
          `hallTechnologyId = ${fetchedHall?.hallTechnologyId}`
        );
        const [fetchedLanguage] = await languageService.getAll(
          `languageId = ${screening.languageId}`
        );
        const [fetchedScreeningFormat] = await screeningFormatService.getAll(
          `screeningFormatId = ${screening.screeningFormatId}`
        );

        setScreeningData({
          movieTitle: "Movie Title",
          date: new Date().toLocaleDateString(),
          availableTickets: allSeats.length - occupied.length,
          rows,
          columns,
          occupiedSeats: occupied,
          allSeats,
        });

        setHall(fetchedHall);
        setOccupiedSeats(occupied);
        setLanguage(fetchedLanguage);
        setHallTechnology(fetchedHallTechnology);
        setScreeningFormat(fetchedScreeningFormat);
      } catch (err) {
        console.error("Error loading screening data:", err);
      }
    };

    fetchData();
  }, [id]);

  return {
    screeningData,
    selectedSeats,
    occupiedSeats,
    hall,
    language,
    hallTechnology,
    screeningFormat,
    setSelectedSeats,
  };
};

export default useScreeningData;
