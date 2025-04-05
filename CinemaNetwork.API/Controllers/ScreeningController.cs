using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Screening")]
    [ApiController]
    public class ScreeningController : GenericController<Screening, ScreeningDto>
    {
        public ScreeningController(IService<Screening, ScreeningDto> service) 
            : base(service)
        {
        }
    }
}
