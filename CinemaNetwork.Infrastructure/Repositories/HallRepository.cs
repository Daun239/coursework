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
    public class HallRepository : IHallRepository
    {
        private readonly CinemaNetworkContext _context;

        public HallRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all halls (returns entities directly)
        public async Task<List<Hall>> GetAllAsync()
        {
            return await _context.Halls
                .Include(h => h.Cinema) // Include related Cinema if needed
                .Include(h => h.HallTechnology) // Include related HallTechnology if needed
                .ToListAsync(); // Return the list of Hall entities directly
        }

        // Get hall by Id (returns entity directly)
        public async Task<Hall?> GetByIdAsync(int id)
        {
            return await _context.Halls
                .Include(h => h.Cinema) // Include related Cinema if needed
                .Include(h => h.HallTechnology) // Include related HallTechnology if needed
                .FirstOrDefaultAsync(h => h.HallId == id); // Return Hall entity directly
        }

        // Create a new hall (returns entity directly)
        public async Task<Hall> CreateAsync(Hall updateHallDto)
        {
            var createdHall = await _context.Halls.AddAsync(updateHallDto);
            await _context.SaveChangesAsync();

            return createdHall.Entity; // Return the newly created Hall entity directly
        }

        // Update an existing hall (returns entity directly)
        public async Task<Hall?> UpdateAsync(int id, Hall updateHallDto)
        {
            var existingHall = await _context.Halls.FirstOrDefaultAsync(h => h.HallId == id);
            if (existingHall == null)
            {
                return null; // Hall not found
            }

            // Update the hall entity using the mapper
            // existingHall = updateHallDto.ToHallFromUpdateDto();

            existingHall.UpdateDateTime = DateTime.Now;
            existingHall.HallTechnologyId = updateHallDto.HallTechnologyId;
            existingHall.CinemaId = updateHallDto.CinemaId;
            existingHall.HallNumber = updateHallDto.HallNumber;

            _context.Halls.Update(existingHall); // Update the entity in the context
            await _context.SaveChangesAsync();

            return existingHall; // Return the updated Hall entity directly
        }

        // Delete a hall by Id (returns entity directly)
        public async Task<Hall?> DeleteAsync(int id)
        {
            var hall = await _context.Halls.FirstOrDefaultAsync(h => h.HallId == id);
            if (hall == null)
            {
                return null; // Hall not found
            }

            _context.Halls.Remove(hall);
            await _context.SaveChangesAsync();

            return hall; // Return the deleted Hall entity directly
        }
    }
}
