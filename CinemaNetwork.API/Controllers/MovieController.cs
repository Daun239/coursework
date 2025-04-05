using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Movie")]
    [ApiController]
    public class MovieController : GenericController<Movie, MovieDto>
    {
        public MovieController(IService<Movie, MovieDto> service) 
            : base(service)
        {
        }
    }
}
