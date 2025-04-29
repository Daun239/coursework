import formFilterQuery from "@/lib/formFilterQuery";
import { RunService } from "@/lib/Run";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Hall } from "@/Types/Hall";
import { HallTechnology } from "@/Types/HallTechnology";
import { Language } from "@/Types/Language";
import { ScreeningFormat } from "@/Types/ScreeningFormat";
import { Seat } from "@/Types/Seat";
import { useState, useEffect } from "react";

const useScreeningData = (id: string | number | undefined) => {
  const [screeningData, setScreeningData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<Seat[]>([]);
  const [hall, setHall] = useState<Hall | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [hallTechnology, setHallTechnology] = useState<HallTechnology | null>(
    null
  );
  const [screeningFormat, setScreeningFormat] =
    useState<ScreeningFormat | null>(null);

  const {
    screeningFormatService,
    hallTechnologyService,
    languageService,
    screeningService,
    hallService,
    seatService,
    ticketService,
    runService,
    movieService,
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

        const [fetchedRun] = await runService.getAll(
          `runId = ${screening.runId}`
        );

        const [fetchedMovie] = await movieService.getAll(
          `movieId = ${fetchedRun.movieId}`
        );

        // Update state with all fetched data
        setScreeningData({
          movieTitle: fetchedMovie.name,
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
        setLanguage(fetchedLanguage || null);
        setHallTechnology(fetchedHallTechnology || null);
        setScreeningFormat(fetchedScreeningFormat || null);
      } catch (err) {
        console.error("Error loading screening data:", err);
      }
    };

    fetchData();
  }, [
    id,
    screeningService,
    hallService,
    seatService,
    ticketService,
    hallTechnologyService,
    languageService,
    screeningFormatService,
  ]);

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
