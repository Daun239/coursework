using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ScreeningFormat")]
    [ApiController]
    public class ScreeningFormatController : GenericController<ScreeningFormat, ScreeningFormatDto>
    {
        public ScreeningFormatController(IService<ScreeningFormat, ScreeningFormatDto> service) 
            : base(service)
        {
        }
    }
}
