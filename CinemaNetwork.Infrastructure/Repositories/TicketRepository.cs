using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly CinemaNetworkContext _context;

        public TicketRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Create a new ticket and return the entity
        public async Task<Ticket> CreateAsync(Ticket updateTicketDto)
        {
            var ticket = new Ticket
            {
                // Set the properties based on the updateTicketDto
                // Assuming `toTicketFromUpdateDto` maps DTO to entity
                SeatId = updateTicketDto.SeatId,
                ScreeningId = updateTicketDto.ScreeningId,
                Price = updateTicketDto.Price,
                Number = updateTicketDto.Number,
                // other properties...
            };

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();

            return ticket; // Return the created entity
        }

        // Delete a ticket by its ID and return the entity
        public async Task<Ticket?> DeleteAsync(int id)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.TicketId == id);
            if (ticket == null)
            {
                return null; // If ticket not found, return null
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return ticket; // Return the deleted ticket entity
        }

        public async Task<List<Ticket>> GetAllAsync()
        {
            var tickets = await _context.Tickets.ToListAsync(); // Return a list of entities

            // Log the count of tickets fetched
            Debug.WriteLine($"Fetched {tickets.Count} tickets.");

            // Log the details of each ticket (you may want to customize the properties logged here)
            // Debug.WriteLine("Ticket details: " + string.Join(", ", tickets.Select(t => $"{t.Id} - {t.Name}")));

            return tickets;
        }


        // Get a specific ticket by its ID and return the entity
        public async Task<Ticket?> GetByIdAsync(int id)
        {
            return await _context.Tickets.FirstOrDefaultAsync(t => t.TicketId == id); // Return entity
        }

        // Update a ticket by its ID and return the updated entity
        public async Task<Ticket?> UpdateAsync(int id, Ticket updateTicketDto)
        {
            var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.TicketId == id);
            if (ticket == null)
            {
                return null; // If ticket not found, return null
            }

            // Map values from DTO to the ticket entity
            ticket.SeatId = updateTicketDto.SeatId;
            ticket.ScreeningId = updateTicketDto.ScreeningId;
            ticket.Price = updateTicketDto.Price;
            ticket.Number = updateTicketDto.Number;

            await _context.SaveChangesAsync();

            return ticket; // Return the updated ticket entity
        }
    }
}
