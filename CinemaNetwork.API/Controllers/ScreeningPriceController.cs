
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ScreeningPrice")]
    [ApiController]
    public class ScreeningPriceController : GenericController<ScreeningPrice, ScreeningPriceDto>
    {
        public ScreeningPriceController(IService<ScreeningPrice, ScreeningPriceDto> service) 
            : base(service)
        {
        }
    }
}
