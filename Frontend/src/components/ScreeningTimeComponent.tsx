import formFilterQuery from "@/lib/formFilterQuery";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Hall } from "@/Types/Hall";
import { Screening } from "@/Types/Screening";
import { Seat } from "@/Types/Seat";
import { Ticket } from "@/Types/Ticket";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { enUS, uk } from "date-fns/locale";
import { useCartStore } from "@/Features/Cart/Stores/CartState";
import { useLanguageStore } from "@/Stores/useLanguageStore";

interface Props {
    screening: Screening;
    onSelect?: (screening: Screening) => void;
    onSelectScreeningId: (screeningId: number) => void;
}

const translations = {
    en: {
        errorDate: "Error: Invalid date or time",
        errorDateTime: "Error: Invalid date time",
        soldOut: "Sold out",
        availableSeats: (count: number) => `${count} seat${count !== 1 ? 's' : ''} available`,
    },
    ua: {
        errorDate: "Помилка: недійсні дата або час",
        errorDateTime: "Помилка: недійсний формат дати й часу",
        soldOut: "Розпродано",
        availableSeats: (count: number) =>
            `${count} міс${count === 1 ? '' : count < 5 ? 'ця' : 'ць'} доступно`,
    },
};

const CalendarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SeatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ScreeningTimeComponent: React.FC<Props> = ({ screening, onSelect, onSelectScreeningId }) => {
    const { startDate, startTime, endTime } = screening;
    const { ticketService, seatService, hallService, screeningPriceService } = useServiceStore();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [availableSeats, setAvailableSeats] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { cart } = useCartStore();
    const { language } = useLanguageStore() || "en";
    const t = translations[language] ?? translations["en"];



    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const screeningPrices = await screeningPriceService.getAll(`screeningId = ${screening.screeningId}`);


                const ticketsQuery = formFilterQuery("AND", {
                    field: "screeningPriceId",
                    operator: "in",
                    values: screeningPrices.map((p) => p.screeningPriceId)
                })

                const tickets = await ticketService.getAll(ticketsQuery, "", 1, 1000);
                const seatQuery = formFilterQuery("OR", {
                    field: 'seatId',
                    operator: 'in',
                    values: tickets.map(t => t.seatId)
                });

                const seats = await seatService.getAll(seatQuery, "", 1, 1000);
                const [hall] = await hallService.getAll(`hallId = ${screening.hallId}`, '', 1, 1);
                const seatsInHall = await seatService.getAll(`hallId = ${hall.hallId}`, "", 1, 1000);

                const occupiedSeatIds = new Set(seats.map(seat => seat.seatId));
                const available = seatsInHall.filter(seat => !occupiedSeatIds.has(seat.seatId)).length;

                setTickets(tickets);
                setAvailableSeats(available);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [screening, ticketService, seatService, hallService, cart.ticket]);

    if (!startDate || !startTime || !endTime) {
        return <div className="p-2 rounded-xl border bg-red-100 text-red-700">{t.errorDate}</div>;
    }

    const startDateTime = `${startDate}T${startTime}`;
    const startDateObj = new Date(startDateTime);
    const endDateTime = `${startDate}T${endTime}`;
    const endDateObj = new Date(endDateTime);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        return <div className="p-2 rounded-xl border bg-red-100 text-red-700">{t.errorDateTime}</div>;
    }

    const locale = language === 'ua' ? uk : enUS;

    const formattedDate = format(startDateObj, 'd MMMM yyyy', { locale });
    const formattedStartTime = format(startDateObj, 'HH:mm');
    const formattedEndTime = format(endDateObj, 'HH:mm');
    const isSoldOut = availableSeats <= 0;

    if (isLoading) {
        return (
            <div className="p-3 rounded-xl border shadow-sm animate-pulse">
                <div className="h-5 rounded w-3/4 mb-2 bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-4 rounded w-1/2 bg-gray-200 dark:bg-gray-700"></div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onSelect?.(screening)}
            className={`relative cursor-pointer p-3 rounded-xl border shadow-md transition-all hover:shadow-lg ${isSoldOut ? 'bg-gray-100 text-gray-500' : 'dark:hover:bg-gray-800 dark:bg-gray-900'}`}
        >
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex space-x-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectScreeningId(screening.screeningId);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4h2m-1 0v12m-4 4h10a2 2 0 002-2v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2a2 2 0 002 2z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // TODO: handle delete, or pass `onDelete(screening)` if you define it
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center mb-1">
                <CalendarIcon />
                <span className="font-medium text-sm">{formattedDate}</span>
            </div>
            <div className="flex items-center mb-1">
                <ClockIcon />
                <span className="font-medium">{`${formattedStartTime} - ${formattedEndTime}`}</span>
            </div>
            <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                <SeatIcon />
                <span className={`${isSoldOut ? 'text-red-500 font-semibold' : 'text-green-600'}`}>
                    {isSoldOut ? t.soldOut : t.availableSeats(availableSeats)}
                </span>
            </div>
        </div>
    );

};

export default ScreeningTimeComponent;
