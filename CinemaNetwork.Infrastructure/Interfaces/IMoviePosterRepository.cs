using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IMoviePosterRepository
    {
        Task<List<MoviePoster>> GetAllAsync();
        Task<MoviePoster?> GetByIdAsync(int id);
        Task<MoviePoster?> UpdateAsync(int MovieGenreId, MoviePoster moviePoster);
        Task<MoviePoster> CreateAsync(int MovieId, MoviePoster poster);
        Task<MoviePoster?> DeleteAsync(int id);
    }
}