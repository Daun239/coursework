using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.API.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ticket")]
    [ApiController]
    public class TicketController : GenericController<Ticket, TicketDto>
    {
        public TicketController(IService<Ticket, TicketDto> service) 
            : base(service)
        {
        }
    }
}
