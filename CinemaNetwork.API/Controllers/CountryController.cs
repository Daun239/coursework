
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Country")]
    [ApiController]
    public class CountryController : GenericController<Country, CountryDto>
    {
        public CountryController(IService<Country, CountryDto> service) 
            : base(service)
        {
        }
    }
}
