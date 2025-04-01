using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.API.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/run")]
    [ApiController]
    public class RunController : GenericController<Run, RunDto>
    {
        public RunController(IService<Run, RunDto> service) 
            : base(service)
        {
        }
    }
}
