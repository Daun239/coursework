
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
    public EmployeeController(IEmployeeService service) 
    : base(service)
{
    var serviceType = service.GetType().Name;
    Console.WriteLine($"Service injected: {serviceType}");
    // Should print EmployeeService, not Service<Employee, EmployeeDto>
}
}

}
