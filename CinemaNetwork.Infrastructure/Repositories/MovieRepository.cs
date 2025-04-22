using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class MovieRepository : Repository<Movie>, IMovieRepository
    {
        public MovieRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
