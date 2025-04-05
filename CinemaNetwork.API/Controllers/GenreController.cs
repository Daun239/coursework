using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Genre")]
    [ApiController]
    public class GenreController : GenericController<Genre, GenreDto>
    {
        public GenreController(IService<Genre, GenreDto> service) 
            : base(service)
        {
        }
    }
}
