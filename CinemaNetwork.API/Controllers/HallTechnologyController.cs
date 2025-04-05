using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/HallTechnology")]
    [ApiController]
    public class HallTechnologyController : GenericController<HallTechnology, HallTechnologyDto>
    {
        public HallTechnologyController(IService<HallTechnology, HallTechnologyDto> service) 
            : base(service)
        {
        }
    }
}
