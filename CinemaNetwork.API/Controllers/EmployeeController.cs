
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Employee")]
    [ApiController]
    public class EmployeeController : GenericController<Employee, EmployeeDto>
    {
        public EmployeeController(IService<Employee, EmployeeDto> service) 
            : base(service)
        {
        }
    }
}
