using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/EmployeePosition")]
    [ApiController]
    public class EmployeePositionController : GenericController<EmployeePosition, EmployeePositionDto>
    {
        public EmployeePositionController(IService<EmployeePosition, EmployeePositionDto> service)
            : base(service)
        {
        }

    }
}
