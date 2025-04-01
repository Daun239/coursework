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
    public class ScreeningFormatRepository : IScreeningFormatRepository
    {
        private readonly CinemaNetworkContext _context;

        public ScreeningFormatRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all screening formats
        public async Task<List<ScreeningFormat>> GetAllAsync()
        {
            return await _context.ScreeningFormats.ToListAsync();
        }

        // Get a screening format by ID
        public async Task<ScreeningFormat?> GetByIdAsync(int id)
        {
            return await _context.ScreeningFormats.FirstOrDefaultAsync(sf => sf.ScreeningFormatId == id);
        }

        // Create a new screening format
        public async Task<ScreeningFormat> CreateAsync(string screeningFormat)
        {
            var newScreeningFormat = new ScreeningFormat
            {
                ScreeningFormat1 = screeningFormat,
            };

            var result = await _context.ScreeningFormats.AddAsync(newScreeningFormat);
            await _context.SaveChangesAsync();

            return result.Entity;
        }

        public async Task<ScreeningFormat?> UpdateAsync(int id, string screeningFormat)
        {
            var existingScreeningFormat = await _context.ScreeningFormats.FirstOrDefaultAsync(sf => sf.ScreeningFormatId == id);

            if (existingScreeningFormat == null)
            {
                return null;
            }

            existingScreeningFormat.ScreeningFormat1 = screeningFormat;

            await _context.SaveChangesAsync();

            return existingScreeningFormat;
        }

        // Delete a screening format by ID
        public async Task<ScreeningFormat?> DeleteAsync(int id)
        {
            var screeningFormat = await _context.ScreeningFormats.FirstOrDefaultAsync(sf => sf.ScreeningFormatId == id);

            if (screeningFormat == null)
            {
                return null; // Screening format not found
            }

            _context.ScreeningFormats.Remove(screeningFormat);
            await _context.SaveChangesAsync();

            return screeningFormat;
        }
    }
}
