
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/City")]
    [ApiController]
    public class CityController : GenericController<City, CityDto>
    {
        public CityController(IService<City, CityDto> service) 
            : base(service)
        {
        }
    }
}
