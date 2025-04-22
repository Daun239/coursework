using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/MovieGenre")]
    [ApiController]
    public class MovieGenreController : GenericController<MoviesGenre, MoviesGenreDto>
    {
        public MovieGenreController(IService<MoviesGenre, MoviesGenreDto> service) 
            : base(service)
        {
        }
    }
}
