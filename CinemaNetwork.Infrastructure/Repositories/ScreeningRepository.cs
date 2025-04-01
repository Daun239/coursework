using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class ScreeningRepository : IScreeningRepository
    {
        private readonly CinemaNetworkContext _context;

        public ScreeningRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all screenings
        public async Task<List<Screening>> GetAllAsync()
        {
            return await _context.Screenings
            .Include(s => s.ScreeningFormat)
            .Include(s => s.Hall)
            .Include(s => s.Language)
            .Include(s => s.Run)
            .ToListAsync();
        }

        // Get a screening by ID
        public async Task<Screening?> GetByIdAsync(int id)
        {
            return await _context.Screenings
            .Include(s => s.ScreeningFormat)
            .Include(s => s.Hall)
            .Include(s => s.Language)
            .Include(s => s.Run)
            .FirstOrDefaultAsync(s => s.ScreeningId == id);
        }

        // Create a new screening
        public async Task<Screening> CreateAsync(Screening updateScreeningDto)
        {
            await _context.Screenings.AddAsync(updateScreeningDto);
            await _context.SaveChangesAsync();

            return updateScreeningDto;
        }

        // Update an existing screening
        public async Task<Screening?> UpdateAsync(Screening updateScreeningDto)
        {
            var screening = await _context.Screenings.FirstOrDefaultAsync(s => s.ScreeningId == updateScreeningDto.ScreeningFormatId);
            if (screening == null)
                return null;

            // screening.UpdateScreeningFromDto(updateScreeningDto);
            screening.UpdateDateTime = DateTime.Now;
            screening.StartDate = updateScreeningDto.StartDate;
            screening.EndTime = updateScreeningDto.EndTime;
            screening.StartDate = updateScreeningDto.StartDate;
            screening.HallId = updateScreeningDto.HallId;
            screening.RunId = updateScreeningDto.RunId;

            await _context.SaveChangesAsync();

            return screening;
        }

        // Delete a screening by ID
        public async Task<Screening?> DeleteAsync(int id)
        {
            var screening = await _context.Screenings.FirstOrDefaultAsync(s => s.ScreeningId == id);
            if (screening == null)
                return null;

            _context.Screenings.Remove(screening);
            await _context.SaveChangesAsync();

            return screening;
        }
    }
}
