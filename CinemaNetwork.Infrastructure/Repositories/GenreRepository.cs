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
    public class GenreRepository : IGenreRepository
    {
        private readonly CinemaNetworkContext _context;

        public GenreRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all genres
        public async Task<List<Genre>> GetAllAsync()
        {
            return await _context.Genres.ToListAsync();
        }

        // Get genre by Id
        public async Task<Genre?> GetByIdAsync(int id)
        {
            return await _context.Genres.FirstOrDefaultAsync(g => g.GenreId == id);
        }

        // Create a new genre
        public async Task<Genre> CreateAsync(string genre)
        {
            var newGenre = new Genre { Genre1 = genre };
            var addedGenre = await _context.Genres.AddAsync(newGenre);
            await _context.SaveChangesAsync();
            return addedGenre.Entity; // Returning the created genre
        }

        // Update an existing genre
        public async Task<Genre?> UpdateAsync(int id, string genre)
        {
            var existingGenre = await _context.Genres.FirstOrDefaultAsync(g => g.GenreId == id);
            if (existingGenre == null)
            {
                return null; // Genre not found
            }

            existingGenre.Genre1 = genre;

            // Save changes
            await _context.SaveChangesAsync();
            return existingGenre; // Return updated genre
        }

        // Delete a genre by Id
        public async Task<Genre?> DeleteAsync(int id)
        {
            var genre = await _context.Genres.FirstOrDefaultAsync(g => g.GenreId == id);
            if (genre == null)
            {
                return null; // Genre not found
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();
            return genre; // Return deleted genre
        }
    }
}
