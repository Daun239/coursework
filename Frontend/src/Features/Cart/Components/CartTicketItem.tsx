import getItemId from "@/lib/GetItemId";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Hall } from "@/Types/Hall";
import { Movie } from "@/Types/Movie";
import { Screening } from "@/Types/Screening";
import { Seat } from "@/Types/Seat";
import { Ticket } from "@/Types/Ticket";
import { useState, useEffect } from "react";
import { BsTrash } from "react-icons/bs";
import { useCartStore } from "../Stores/CartState";

const CartTicketComponent = ({
    item
}: {
    item: Ticket;
}) => {
    const id = getItemId(item);

    const cart = useCartStore((state) => state.cart['ticket']);
    const cartItem = cart.find((i) => getItemId(i) === id);

    const removeItem = useCartStore((state) => state.removeItem);

    if (!cartItem) return null; // якщо елемент видалено

    const handleRemoveItem = () => {
        removeItem('ticket', id);
    };

    const [movie, setMovie] = useState<Movie | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [seat, setSeat] = useState<Seat | null>(null);
    const [hall, setHall] = useState<Hall | null>(null);

    const { runService, movieService, screeningService, seatService, hallService } = useServiceStore();

    useEffect(() => {
        const fetchData = async () => {
            // Fetch screening
            const [screeningData] = await screeningService.getAll(`screeningId = ${item.screeningId}`, '', 1, 1);
            setScreening(screeningData);

            if (screeningData) {
                // Fetch run data
                const [runData] = await runService.getAll(`runId = ${screeningData.runId}`);
                if (runData) {
                    // Fetch movie data
                    const [movieData] = await movieService.getAll(`movieId = ${runData.movieId}`);
                    setMovie(movieData);
                }

                // Fetch seat data
                const [seatData] = await seatService.getAll(`seatId = ${item.seatId}`);
                setSeat(seatData);

                // Fetch hall data
                const [hallData] = await hallService.getAll(`hallId = ${screeningData.hallId}`);
                setHall(hallData);
            }
        };

        fetchData();
    }, [item, screeningService, runService, movieService, seatService, hallService]);

    return (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
                {movie?.title || 'Unnamed ticket'}
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
                Seat: <span className="font-medium">{seat?.rowNumber}-{seat?.seatNumber}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-3">
                Price: <span className="font-medium text-gray-800 dark:text-gray-100">${cartItem.price}</span>
            </p>

            <button
                onClick={handleRemoveItem}
                className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
                <BsTrash className="mr-1" /> Remove
            </button>
        </div>
    );
};

export default CartTicketComponent;
