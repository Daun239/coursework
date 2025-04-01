using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class SeatRepository : ISeatRepository
    {
        private readonly CinemaNetworkContext _context;

        public SeatRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Create a new Seat (Entity returned)
        public async Task<Seat> SeatCreateAsync(Seat updateSeatDto)
        {
            var seat = new Seat
            {
                SeatNumber = updateSeatDto.SeatNumber,
                RowNumber = updateSeatDto.RowNumber,
                IsVipCategory = updateSeatDto.IsVipCategory,
                UpdateDateTime = DateTime.Now
            };

            await _context.Seats.AddAsync(seat);
            await _context.SaveChangesAsync();

            return seat; // Return entity, not DTO
        }

        // Delete a Seat by its ID (Entity returned)
        public async Task<Seat?> DeleteAsync(int id)
        {
            var seat = await _context.Seats.FirstOrDefaultAsync(s => s.SeatId == id);
            if (seat == null)
            {
                return null; // Return null if Seat not found
            }

            _context.Seats.Remove(seat);
            await _context.SaveChangesAsync();

            return seat; // Return entity
        }

        // Get all Seats (Entities returned)
        public async Task<List<Seat>> GetAllAsync()
        {
            return await _context.Seats.ToListAsync(); // Return list of entities
        }

        // Get a specific Seat by its ID (Entity returned)
        public async Task<Seat?> GetByIdAsync(int id)
        {
            return await _context.Seats.FirstOrDefaultAsync(s => s.SeatId == id); // Return entity
        }

        // Update a Seat by its ID (Entity returned)
        public async Task<Seat?> UpdateAsync(int id, Seat updateSeatDto)
        {
            var seat = await _context.Seats.FirstOrDefaultAsync(s => s.SeatId == id);
            if (seat == null)
            {
                return null; // Return null if no Seat is found
            }

            // Update seat entity with values from DTO
            seat.SeatNumber = updateSeatDto.SeatNumber;
            seat.RowNumber = updateSeatDto.RowNumber;
            seat.IsVipCategory = updateSeatDto.IsVipCategory;
            seat.UpdateDateTime = DateTime.Now;

            await _context.SaveChangesAsync();

            return seat; // Return updated entity
        }
    }
}
