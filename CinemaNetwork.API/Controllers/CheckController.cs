
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Check")]
    [ApiController]
    public class CheckController : GenericController<Check, CheckDto>
    {
        public CheckController(IService<Check, CheckDto> service) 
            : base(service)
        {
        }
    }
}
