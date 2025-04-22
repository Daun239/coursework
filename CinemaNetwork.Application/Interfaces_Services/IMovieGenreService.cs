using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Interfaces_Services
{
    public interface IMovieGenreService : IService<MoviesGenre, MoviesGenreDto>
    {
    }
}
