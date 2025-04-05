
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Cinema")]
    [ApiController]
    public class CinemaController : GenericController<Cinema, CinemaDto>
    {
        public CinemaController(IService<Cinema, CinemaDto> service) 
            : base(service)
        {
        }
    }
}
