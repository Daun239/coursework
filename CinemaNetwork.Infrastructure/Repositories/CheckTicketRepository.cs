using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class CheckTicketRepository : ICheckTicketRepository
    {
        private readonly CinemaNetworkContext _context;

        public CheckTicketRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all CheckTickets (returns entities, not DTOs)
        public async Task<List<CheckTicket>> GetAllAsync()
        {
            return await _context.CheckTickets
                .Include(ct => ct.Ticket)
                .Include(ct => ct.Check)
                .ToListAsync();
        }

        // Get a CheckTicket by its ID (returns entity)
        public async Task<CheckTicket?> GetByIdAsync(int id)
        {
            return await _context.CheckTickets
                .Include(ct => ct.Ticket)
                .Include(ct => ct.Check)
                .FirstOrDefaultAsync(ct => ct.CheckTicketId == id);
        }
        
        // Create a new CheckTicket entry
        public async Task<CheckTicket?> AddAsync(CheckTicket checkTicketDto)
        {
            var checkTicket = new CheckTicket
            {
                TicketId = checkTicketDto.TicketId,
                CheckId = checkTicketDto.CheckId,
            };

            await _context.CheckTickets.AddAsync(checkTicket);
            await _context.SaveChangesAsync();

            return checkTicket; // Return entity, not DTO
        }

        // Update an existing CheckTicket
        public async Task<CheckTicket?> UpdateAsync(CheckTicket updateCheckTicketDto)
        {
            var checkTicket = await _context.CheckTickets.FirstOrDefaultAsync(ct => ct.CheckTicketId == updateCheckTicketDto.CheckTicketId);
            if (checkTicket == null)
            {
                return null; // If not found, return null
            }

            checkTicket.UpdateDateTime = DateTime.Now;
            checkTicket.CheckId = updateCheckTicketDto.CheckId;
            checkTicket.TicketId = updateCheckTicketDto.TicketId;

            await _context.SaveChangesAsync();

            return checkTicket; // Return updated entity
        }

        // Delete a CheckTicket
        public async Task<CheckTicket?> DeleteAsync(int id)
        {
            var checkTicket = await _context.CheckTickets.FirstOrDefaultAsync(ct => ct.CheckTicketId == id);
            if (checkTicket == null)
            {
                return null; // If not found, return null
            }

            _context.CheckTickets.Remove(checkTicket);
            await _context.SaveChangesAsync();

            return checkTicket; // Return deleted entity
        }
    }
}
