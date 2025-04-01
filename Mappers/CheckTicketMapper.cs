using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.CheckTicket;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class CheckTicketMapper
    {
        // Map CheckTicket to CheckTicketDto
        public static CheckTicketDto ToCheckTicketDto(this CheckTicket checkTicket)
        {
            return new CheckTicketDto
            {
                CheckTicketsId = checkTicket.CheckTicketsId,
                CheckId = checkTicket.CheckId,
                TicketId = checkTicket.TicketId,
                Checks = checkTicket.Checks?.ToCheckFromDto(), // Assuming Check has a corresponding mapping method
                Tickets = checkTicket.Tickets?.FromTicketToDto() // Assuming Ticket has a corresponding mapping method
            };
        }

        // Map UpdateCheckTicketDto to CheckTicket (for updating an existing CheckTicket)
        public static CheckTicket ToCheckTicketFromUpdateDto(this UpdateCheckTicketDto updateDto)
        {
            return new CheckTicket
            {
                CheckId = updateDto.CheckId,
                TicketId = updateDto.TicketId,
                UpdateDateTime = DateTime.Now,
            };
        }

        public static CheckTicketDto toDtoFromCheckTicket(this CheckTicket checkTicket)
        {
            return new CheckTicketDto
            {
                CheckTicketsId = checkTicket.CheckTicketsId,
                CheckId = checkTicket.CheckId,
                TicketId = checkTicket.TicketId,
                Tickets = checkTicket.Tickets?.FromTicketToDto(),
                Checks = checkTicket.Checks?.ToCheckFromDto(),
            };
        }
    }
}