using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Ticket")]
    [ApiController]
    public class TicketController : GenericController<Ticket, TicketDto>
    {
        public TicketController(IService<Ticket, TicketDto> service) 
            : base(service)
        {
        }
    }
}
