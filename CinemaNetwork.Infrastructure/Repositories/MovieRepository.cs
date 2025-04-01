using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class MovieRepository : IMovieRepository
    {
        private readonly CinemaNetworkContext _context;

        public MovieRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Retrieve all movies
        public async Task<List<Movie>> GetAllAsync()
        {
            return await _context.Movies
            .Include(m => m.Publisher)
            .Include(m => m.AgeRestriction)
            .Include(m => m.Country)
            .Include(m => m.Language)
            .ToListAsync();
        }

        // Retrieve a specific movie by ID
        public async Task<Movie?> GetByIdAsync(int id)
        {
            return await _context.Movies
                .Include(m => m.Publisher)
                .Include(m => m.AgeRestriction)
                .Include(m => m.Country)
                .Include(m => m.Language)
                .FirstOrDefaultAsync(m => m.MovieId == id);
        }


        // Create a new movie
        public async Task<Movie> CreateAsync(Movie movieDto)
        {
            var movie = new Movie
            {
                Name = movieDto.Name,
                CountryId = movieDto.CountryId,
                AgeRestrictionId = movieDto.AgeRestrictionId,
                PublisherId = movieDto.PublisherId,
                Runtime = movieDto.Runtime,
                Description = movieDto.Description,
                Budget = movieDto.Budget,
                LanguageId = movieDto.LanguageId,
                CreateDateTime = DateTime.Now,
                // Poster = movieDto.Poster,
            };

            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();
            return movie; // Return the created entity
        }

        // Update an existing movie
        public async Task<Movie?> UpdateAsync(int id, Movie movieDto)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == id);
            if (movie == null)
            {
                return null; // Return null if movie not found
            }

            movie.Name = movieDto.Name;
            movie.CountryId = movieDto.CountryId;
            movie.AgeRestrictionId = movieDto.AgeRestrictionId;
            movie.PublisherId = movieDto.PublisherId;
            movie.Runtime = movieDto.Runtime;
            movie.Description = movieDto.Description;
            movie.Budget = movieDto.Budget;
            movie.LanguageId = movieDto.LanguageId;
            movie.UpdateDateTime = DateTime.Now;
            // movie.Poster = movieDto.Poster;

            await _context.SaveChangesAsync();
            return movie; // Return the updated entity
        }

        // Delete a movie by ID
        public async Task<Movie?> DeleteAsync(int id)
        {
            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieId == id);
            if (movie == null)
            {
                return null; // Return null if movie not found
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return movie; // Return the deleted entity
        }
    }
}
