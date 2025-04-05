using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Run")]
    [ApiController]
    public class RunController : GenericController<Run, RunDto>
    {
        public RunController(IService<Run, RunDto> service) 
            : base(service)
        {
        }
    }
}
