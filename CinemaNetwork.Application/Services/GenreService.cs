using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class GenreService : Service<Genre, GenreDto>, IGenreService
    {
        public GenreService(IRepository<Genre> repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
