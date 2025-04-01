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
    public class MovieGenreRepository : Repository<Movie>
    // IMovieGenreRepository
    {
        private readonly CinemaNetworkContext _context;

        public MovieGenreRepository(CinemaNetworkContext context) : base(context)
        {
            _context = context;
        }

        // Retrieve all MovieGenre entries
        // public async Task<List<MovieGenre>> GetAllAsync()
        // {
        //     return await _context.MoviesGenres
        //         .Include(mg => mg.Movies)
        //         .Include(mg => mg.Genres)
        //         .ToListAsync();
        // }

        // // Retrieve a specific MovieGenre by ID
        // public async Task<MovieGenre?> GetByIdAsync(int id)
        // {
        //     return await _context.MoviesGenres
        //         .Include(mg => mg.Movies)
        //         .Include(mg => mg.Genres)
        //         .FirstOrDefaultAsync(mg => mg.MoviesGenresId == id);
        // }

        // // Create a new MovieGenre entry
        // public async Task<MovieGenre> CreateAsync(int MovieId, int GenreId)
        // {
        //     // Check if Movie and Genre exist
        //     var movieExists = await _context.Movies.AnyAsync(m => m.MoviesId == MovieId);
        //     var genreExists = await _context.Genres.AnyAsync(g => g.GenresId == GenreId);

        //     if (!movieExists || !genreExists)
        //     {
        //         throw new ArgumentException("Invalid MovieId or GenreId");
        //     }

        //     var newMovieGenre = new MovieGenre
        //     {
        //         MoviesId = MovieId,
        //         GenresId = GenreId
        //     };

        //     await _context.MoviesGenres.AddAsync(newMovieGenre);
        //     await _context.SaveChangesAsync();

        //     return newMovieGenre;
        // }

        // // Delete a specific MovieGenre by ID
        // public async Task<MovieGenre?> DeleteAsync(int id)
        // {
        //     var movieGenre = await _context.MoviesGenres.FirstOrDefaultAsync(mg => mg.MoviesGenresId == id);
        //     if (movieGenre == null)
        //     {
        //         return null;
        //     }

        //     _context.MoviesGenres.Remove(movieGenre);
        //     await _context.SaveChangesAsync();

        //     return movieGenre;
        // }

        // public async Task<MovieGenre?> UpdateAsync(int MovieGenreId, int genreId, int MovieId)
        // {
        //     // Retrieve the existing MovieGenre by its ID
        //     var movieGenre = await _context.MoviesGenres
        //         .SingleOrDefaultAsync(mg => mg.MoviesGenresId == MovieGenreId);

        //     // Check if the MovieGenre exists
        //     if (movieGenre == null)
        //     {
        //         return null; // Return null if not found
        //     }

        //     // Update the properties
        //     movieGenre.GenreId = genreId;
        //     movieGenre.MovieId = MovieId;

        //     // Save changes to the database
        //     await _context.SaveChangesAsync();

        //     // Return the updated entity
        //     return movieGenre;
        // }
    }
}
