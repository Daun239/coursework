import React, { useEffect, useState } from 'react'
import { Screening } from '../Types/Screening'
import { format } from 'date-fns'
import { useServiceStore } from '../Stores/ServicesStore'
import formFilterQuery from '../Lib/formFilterQuery'
import { Hall } from '../Types/Hall'
import { Ticket } from '../Types/Ticket'
import { Seat } from '../Types/Seat'

interface Props {
    screening: Screening
    onSelect?: (screening: Screening) => void // <== Додаємо
}


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

const ScreeningTimeComponent: React.FC<Props> = ({ screening, onSelect }) => {
    const { startDate, startTime, endTime } = screening
    const { ticketService, seatService, hallService } = useServiceStore();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);
    const [availableSeats, setAvailableSeats] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const tickets = await ticketService.getAll(`screeningId = ${screening.screeningId}`, "", 1, 1000);
                const seatQuery = formFilterQuery("OR",
                    {
                        field: 'seatId',
                        operator: 'in',
                        values: tickets.map(t => t.seatId)
                    }
                );

                const seats = await seatService.getAll(seatQuery, "", 1, 1000);
                const [hall] = await hallService.getAll(`hallId = ${screening.hallId}`, '', 1, 1);
                const seatsInHall = await seatService.getAll(`hallId = ${hall.hallId}`, "", 1, 1000);

                console.log("Tickets:", tickets);
                console.log("Occupied Seats (seats):", seats);
                console.log("Seats in Hall (seatsInHall):", seatsInHall);

                const occupiedSeatIds = new Set(seats.map(seat => seat.seatId)); // Avoid duplicates
                const availableSeats = seatsInHall.filter(seat => !occupiedSeatIds.has(seat.seatId)).length;

                console.log("Available Seats:", availableSeats);

                setTickets(tickets);
                setSeats(seats);
                setHalls([hall]);
                setAvailableSeats(availableSeats);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [screening, ticketService, seatService, hallService]);


    // Перевірка наявності значень перед створенням дати
    if (!startDate || !startTime || !endTime) {
        console.error('Invalid date or time values');
        return <div className="p-2 rounded-xl border bg-red-100 text-red-700">Error: Invalid date or time</div>;
    }

    // Формуємо рядок для startDateTime у форматі YYYY-MM-DDTHH:mm
    const startDateTime = `${startDate}T${startTime}`;

    // Створюємо об'єкт Date з правильним форматом
    const startDateObj = new Date(startDateTime);

    // Перевірка на коректність дати
    if (isNaN(startDateObj.getTime())) {
        console.error('Invalid start date time:', startDateTime);
        return <div className="p-2 rounded-xl border bg-red-100 text-red-700">Error: Invalid date time</div>;
    }

    // Створюємо endDateTime, використовуючи ту ж дату, що й для startDateTime
    const endDateTime = `${startDate}T${endTime}`;
    const endDateObj = new Date(endDateTime);

    // Перевірка на коректність кінцевої дати
    if (isNaN(endDateObj.getTime())) {
        console.error('Invalid end date time:', endDateTime);
        return <div className="p-2 rounded-xl border bg-red-100 text-red-700">Error: Invalid date time</div>;
    }

    const formattedDate = format(startDateObj, 'MMM d, yyyy');
    const formattedStartTime = format(startDateObj, 'HH:mm');
    const formattedEndTime = format(endDateObj, 'HH:mm');
    const isSoldOut = availableSeats <= 0;

    if (isLoading) {
        return (
            <div className="p-3 rounded-xl border shadow-sm bg-gray-50 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        );
    }

    return (
        <div onClick={() => onSelect?.(screening)} // <== Додаємо onClick
            className={`cursor-pointer p-3 rounded-xl border shadow-md transition-all hover:shadow-lg ${isSoldOut ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800 hover:bg-blue-50'
                }`}
            className={`p-3 rounded-xl border shadow-md transition-all hover:shadow-lg ${isSoldOut ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-800 hover:bg-blue-50'
                }`}
        >
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
                    {isSoldOut ? 'Sold out' : `${availableSeats} seat${availableSeats > 1 ? 's' : ''} available`}
                </span>
            </div>
        </div>
    );
};

export default ScreeningTimeComponent;