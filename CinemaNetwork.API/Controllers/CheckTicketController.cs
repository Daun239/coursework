
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/CheckTicket")]
    [ApiController]
    public class CheckTicketController : GenericController<CheckTicket, CheckTicketDto>
    {
        public CheckTicketController(IService<CheckTicket, CheckTicketDto> service) 
            : base(service)
        {
        }
    }
}
