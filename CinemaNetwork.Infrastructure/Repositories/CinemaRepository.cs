using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class CinemaRepository : ICinemaRepository
    {
        private readonly CinemaNetworkContext _context;

        public CinemaRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all cinemas (returns entities)
        public async Task<List<Cinema>> GetAllAsync()
        {
            return await _context.Cinemas.ToListAsync();
        }

        // Get a cinema by ID (returns entity)
        public async Task<Cinema?> GetByIdAsync(int id)
        {
            return await _context.Cinemas.FirstOrDefaultAsync(c => c.CinemaId == id);
        }

        // Create a new cinema (returns entity)
        public async Task<Cinema> AddAsync(Cinema cinema)
        {
            _context.Cinemas.Add(cinema);
            await _context.SaveChangesAsync();
            return cinema;
        }

        // Delete a cinema by ID (returns entity)
        public async Task<Cinema?> DeleteAsync(int id)
        {
            var cinema = await _context.Cinemas.FirstOrDefaultAsync(c => c.CinemaId == id);
            if (cinema == null)
            {
                return null; // If cinema is not found, return null
            }

            _context.Cinemas.Remove(cinema);
            await _context.SaveChangesAsync();
            return cinema;
        }

        // Update a cinema (returns entity)
        public async Task<Cinema?> UpdateAsync(Cinema updateCinemaDto)
        {
            var cinema = await _context.Cinemas.FirstOrDefaultAsync(c => c.CinemaId == updateCinemaDto.CinemaId);
            if (cinema == null)
            {
                return null; // If cinema is not found, return null
            }

            // Update cinema properties
            cinema.Name = updateCinemaDto.Name;
            cinema.Address = updateCinemaDto.Address;
            cinema.CityId = updateCinemaDto.CityId;
            // Map other properties here

            await _context.SaveChangesAsync();
            return cinema;
        }
    }
}
