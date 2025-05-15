import { useMemo } from "react";
import useScreeningData from "@/Features/Screenings/Hooks/UseScreeningData";
import { useCartStore } from "../Stores/CartState";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/Types/Ticket";
import { useScreeningPrice } from "../Hooks/useScreeningPrice";
import { useLanguageStore } from "@/Stores/useLanguageStore";

// Choose language: "en" or "ua"
// eslint-disable-next-line react-hooks/rules-of-hooks



// Translation dictionary


const CartTicketPreview = ({ ticket }: { ticket: Ticket }) => {

    const { language } = useLanguageStore();

    const translations = {
        en: {
            loading: "Loading...",
            row: "Row",
            seat: "Seat",
            price: "Price",
            vip: "VIP",
            yes: "Yes",
            no: "No",
            remove: "Remove",
        },
        ua: {
            loading: "Завантаження...",
            row: "Ряд",
            seat: "Місце",
            price: "Ціна",
            vip: "VIP",
            yes: "Так",
            no: "Ні",
            remove: "Видалити",
        },
    }[language];


    const { removeItem } = useCartStore();
    const { screeningPrice } = useScreeningPrice(ticket.screeningPriceId);

    const screeningId = screeningPrice?.screeningId;
    const { screeningData } = useScreeningData(screeningId ?? -1);

    const seat = screeningData?.allSeats.find((s) => s.seatId === ticket.seatId);

    const highlightedSeat = useMemo(() => {
        if (!screeningData) return [];
        return screeningData.allSeats.filter((seat) => seat.seatId === ticket.seatId);
    }, [screeningData, ticket.seatId]);

    const handleRemoveTicket = () => {
        removeItem("ticket", ticket.ticketId);
    };

    if (!screeningPrice || !screeningData || !seat) return <p>{translations.loading}</p>;

    return (
        <div className="space-y-4">
            <div className="mt-4 border p-3 rounded-md flex justify-between items-center">
                <div>
                    <p className="font-medium">
                        {translations.row}: {seat.rowNumber}, {translations.seat}: {seat.seatNumber}, {translations.price}: {screeningPrice.ticketPrice}₴, {translations.vip}:{" "}
                        <span className={seat.isVipCategory ? "text-purple-600 font-semibold" : "text-gray-500"}>
                            {seat.isVipCategory ? translations.yes : translations.no}
                        </span>
                    </p>
                </div>
                <Button className="cursor-pointer" size="sm" variant="destructive" onClick={handleRemoveTicket}>
                    {translations.remove}
                </Button>
            </div>
        </div>
    );
};

export default CartTicketPreview;
