// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using CinemaNetwork.Infrastructure.Data;
// using CinemaNetwork.Infrastructure.Interfaces;
// using CinemaNetwork.Infrastructure.Models;
// using Microsoft.EntityFrameworkCore;

// namespace CinemaNetwork.Infrastructure.Repositories
// {
//     public class MoviePosterRepository : IMoviePosterRepository
//     {
//         private readonly CinemaNetworkContext _context;

//         public MoviePosterRepository(CinemaNetworkContext context)
//         {
//             _context = context;
//         }

//         public async Task<List<MoviePoster>> GetAllAsync()
//         {
//             return await _context.MoviePosters.Include(p => p.Movie).ToListAsync();
//         }

//         public async Task<MoviePoster?> GetByIdAsync(int id)
//         {
//             return await _context.MoviePosters.Include(p => p.Movie).FirstOrDefaultAsync(p => p.MoviePosterId == id);
//         }

//         public async Task<MoviePoster?> UpdateAsync(int moviePosterId, MoviePoster updatedPoster)
//         {
//             var existingPoster = await _context.MoviePosters.FindAsync(moviePosterId);
//             if (existingPoster == null)
//                 return null;

//             existingPoster.ImageData = updatedPoster.ImageData;
//             existingPoster.PosterFileName = updatedPoster.PosterFileName;
//             existingPoster.MovieId = updatedPoster.MovieId;

//             _context.MoviePosters.Update(existingPoster);
//             await _context.SaveChangesAsync();
//             return existingPoster;
//         }

//         public async Task<MoviePoster> CreateAsync(int movieId, MoviePoster poster)
//         {
//             poster.MovieId = movieId;
//             await _context.MoviePosters.AddAsync(poster);
//             await _context.SaveChangesAsync();
//             return poster;
//         }

//         public async Task<MoviePoster?> DeleteAsync(int id)
//         {
//             var poster = await _context.MoviePosters.FindAsync(id);
//             if (poster == null)
//                 return null;

//             _context.MoviePosters.Remove(poster);
//             await _context.SaveChangesAsync();
//             return poster;
//         }
//     }
// }
