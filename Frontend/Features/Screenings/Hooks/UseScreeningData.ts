import { useState, useEffect } from "react";
import { useServiceStore } from "../../../Stores/ServicesStore";
import formFilterQuery from "../../../Lib/formFilterQuery";
import { Language } from "../../../Types/Language";
import { ScreeningFormat } from "../../../Types/ScreeningFormat";
import { HallTechnology } from "../../../Types/HallTechnology";
import { Seat } from "../../../Types/Seat";
import { Hall } from "../../../Types/Hall";

const useScreeningData = (id: string | number | undefined) => {
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
        // Convert id to number if it's a string
        const screeningId = typeof id === "string" ? parseInt(id) : id;

        // Fetch screening data
        const [screening] = await screeningService.getAll(
          `screeningId = ${screeningId}`
        );

        if (!screening) {
          console.error(`No screening found with ID ${screeningId}`);
          return;
        }

        // Fetch hall data
        const [fetchedHall] = await hallService.getAll(
          `hallId = ${screening.hallId}`,
          ""
        );

        if (!fetchedHall) {
          console.error(`No hall found with ID ${screening.hallId}`);
          return;
        }

        // Fetch all seats for this hall
        const allSeats = await seatService.getAll(
          `hallId = ${fetchedHall.hallId}`,
          "",
          1,
          1000
        );

        // Fetch tickets for this screening
        const ticketsQuery = formFilterQuery("AND", {
          field: "screeningId",
          operator: "in",
          values: [screeningId],
        });

        const tickets = await ticketService.getAll(ticketsQuery, "", 1, 100000);

        // Debug data
        console.log(
          `Found ${tickets.length} tickets for screening ${screeningId}`
        );
        console.log(
          `Found ${allSeats.length} seats in hall ${fetchedHall.hallId}`
        );

        // Create a Set of occupied seat IDs for efficient lookup
        const occupiedSeatIds = new Set(tickets.map((t) => t.seatId));
        console.log("Occupied seat IDs:", Array.from(occupiedSeatIds));

        // Filter seats to find occupied ones
        const occupied = allSeats.filter((seat) =>
          occupiedSeatIds.has(seat.seatId)
        );

        console.log(`After filtering, found ${occupied.length} occupied seats`);

        // Calculate rows and columns for seating layout
        const rows = Math.max(...allSeats.map((s) => s.rowNumber), 1);
        const columns = Math.max(...allSeats.map((s) => s.seatNumber), 1);

        // Fetch additional metadata
        const [fetchedHallTechnology] = await hallTechnologyService.getAll(
          `hallTechnologyId = ${fetchedHall?.hallTechnologyId}`
        );
        const [fetchedLanguage] = await languageService.getAll(
          `languageId = ${screening.languageId}`
        );
        const [fetchedScreeningFormat] = await screeningFormatService.getAll(
          `screeningFormatId = ${screening.screeningFormatId}`
        );

        // Update state with all fetched data
        setScreeningData({
          movieTitle: screening.movieTitle || "Movie Title",
          date: new Date(screening.startDate).toLocaleDateString(),
          startDate: screening.startDate,
          startTime: screening.startTime,
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
