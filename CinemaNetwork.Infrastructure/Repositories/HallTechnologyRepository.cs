using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class HallTechnologyRepository : IHallTechnologyRepository
    {
        private readonly CinemaNetworkContext _context;

        public HallTechnologyRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Method to get all HallTechnology records
        public async Task<List<HallTechnology>> GetAllAsync()
        {
            return await _context.HallTechnologies.ToListAsync();
        }

        // Method to get HallTechnology by its ID
        public async Task<HallTechnology?> GetByIdAsync(int id)
        {
            return await _context.HallTechnologies
                .FirstOrDefaultAsync(ht => ht.HallTechnologyId == id);
        }

        // Method to create a new HallTechnology record
        public async Task<HallTechnology> CreateAsync(string hallTechnology)
        {
            var newHallTechnology = new HallTechnology
            {
                HallTechnology1 = hallTechnology
            };

            await _context.HallTechnologies.AddAsync(newHallTechnology);
            await _context.SaveChangesAsync();

            return newHallTechnology; // Return the created HallTechnology
        }

        // Method to update an existing HallTechnology record
        public async Task<HallTechnology?> UpdateAsync(int id, string hallTechnology)
        {
            var existingHallTechnology = await _context.HallTechnologies
                .FirstOrDefaultAsync(ht => ht.HallTechnologyId == id);

            if (existingHallTechnology == null)
            {
                return null; // If HallTechnology is not found, return null
            }

            existingHallTechnology.HallTechnology1 = hallTechnology;
            await _context.SaveChangesAsync();

            return existingHallTechnology; // Return the updated HallTechnology
        }

        // Method to delete a HallTechnology record
        public async Task<HallTechnology?> DeleteAsync(int id)
        {
            var hallTechnology = await _context.HallTechnologies
                .FirstOrDefaultAsync(ht => ht.HallTechnologyId == id);

            if (hallTechnology == null)
            {
                return null; // If HallTechnology is not found, return null
            }

            _context.HallTechnologies.Remove(hallTechnology);
            await _context.SaveChangesAsync();

            return hallTechnology; // Return the deleted HallTechnology
        }
    }
}
