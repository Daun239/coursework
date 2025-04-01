using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Ticket;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class TicketMapper
    {
        // Маппінг з Ticket в TicketDto
        public static TicketDto FromTicketToDto(this Ticket ticket)
        {
            return new TicketDto
            {
                TicketsId = ticket.TicketsId,
                SeatId = ticket.SeatId,
                Price = ticket.Price,
                Number = ticket.Number,
                ScreeningsId = ticket.ScreeningsId,
            };
        }
        public static Ticket toTicketFromUpdateDto(this UpdateTicketDto updateTicketDto)
        {
            return new Ticket{
                Price = updateTicketDto.Price,
                Number = updateTicketDto.Number,
                ScreeningsId = updateTicketDto.ScreeningsId,
                UpdateDateTime = DateTime.Now,
            }; 
        }
    }
}