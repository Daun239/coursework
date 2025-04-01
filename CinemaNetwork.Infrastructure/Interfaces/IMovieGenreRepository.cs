using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IMovieGenreRepository
    {
        Task<List<MovieGenre>> GetAllAsync();
        Task<MovieGenre?> GetByIdAsync(int id);
        Task<MovieGenre?> UpdateAsync(int MovieGenreId, int genreId, int MovieId);
        Task<MovieGenre> CreateAsync(int MovieId, int GenreId);
        Task<MovieGenre?> DeleteAsync(int id);
    }
}