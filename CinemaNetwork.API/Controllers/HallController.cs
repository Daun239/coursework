using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Hall")]
    [ApiController]
    public class HallController : GenericController<Hall, HallDto>
    {
        public HallController(IService<Hall, HallDto> service) 
            : base(service)
        {
        }
    }
}
