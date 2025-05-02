
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/DeliveryOrder")]
    [ApiController]
    public class DeliveryOrderController : GenericController<DeliveryOrder, DeliveryOrderDto>
{
    public DeliveryOrderController(IDeliveryOrderService service) 
    : base(service)
{
    var serviceType = service.GetType().Name;
    Console.WriteLine($"Service injected: {serviceType}");
    // Should print EmployeeService, not Service<Employee, EmployeeDto>
}
}

}
