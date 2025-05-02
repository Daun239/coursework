import { Hall } from "@/Types/Hall";
import { Movie } from "@/Types/Movie";
import { Screening } from "@/Types/Screening";
import { Ticket } from "@/Types/Ticket";
import { useState, useEffect } from "react";
import CartTicketItem from "./CartTicketItem";
import { useServiceStore } from "@/Stores/ServicesStore";
import fetchPosterFromTMDb from "@/Utils/fetchPosterFromImdb";

const GroupedTicketsSection = ({
    screeningId,
    tickets,
    onClick = () => { },
}: {
    screeningId: number;
    tickets: Ticket[];
    onClick: (screningId: number) => void;
}) => {
    const [screening, setScreening] = useState<Screening | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [hall, setHall] = useState<Hall | null>(null);

    const { screeningService, runService, movieService, hallService } = useServiceStore();

    const [posterUrl, setPosterUrl] = useState<string | null>(null);


    useEffect(() => {
        const fetchPoster = async () => {
            if (!movie?.name) return;

            const poster = await fetchPosterFromTMDb(movie.name);
            if (poster) {
                setPosterUrl(poster);
            }
        };

        fetchPoster();
    }, [movie]);



    useEffect(() => {
        const fetchData = async () => {
            const [screeningData] = await screeningService.getAll(`screeningId = ${screeningId}`);
            setScreening(screeningData);

            if (screeningData) {
                const [runData] = await runService.getAll(`runId = ${screeningData.runId}`);
                if (runData) {
                    const [movieData] = await movieService.getAll(`movieId = ${runData.movieId}`);
                    setMovie(movieData);
                }

                const [hallData] = await hallService.getAll(`hallId = ${screeningData.hallId}`);
                setHall(hallData);
            }
        };

        fetchData();
    }, [screeningId]);

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-inner flex gap-4 hover:bg-gray-200"
            onClick={() => onClick(screeningId)}
        >
            {/* Poster */}
            {posterUrl && (
                <img
                    src={posterUrl}
                    alt={`${movie?.name} poster`}
                    className="w-24 h-auto rounded-md object-cover"
                />
            )}

            {/* Info and Tickets */}
            <div className="flex-1 space-y-2">
                <div className="text-gray-700 dark:text-gray-200 font-semibold">
                    {screening && (
                        <div>
                            🎬 {movie?.name || 'Loading...'} • 🏛 Hall Number {hall?.hallNumber || '...'} • 📅{' '}
                            {new Date(screening.startDate).toLocaleDateString()} 🕒{' '}
                            {`${screening?.startTime.slice(0, 5)} - ${screening?.endTime.slice(0, 5)}`}
                        </div>
                    )}
                </div>

                {/* Tickets grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {tickets.map((ticket) => (
                        <CartTicketItem key={ticket.ticketId} ticket={ticket} />
                    ))}
                </div>
            </div>
        </div>
    );

};

export default GroupedTicketsSection