using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        // GET: api/Ticket
        [HttpGet]
        public async Task<ActionResult<List<TicketDto>>> GetAll()
        {
            var tickets = await _ticketService.GetAllAsync();
            return Ok(tickets);
        }

        // GET: api/Ticket/
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetById(int id)
        {
            var ticket = await _ticketService.GetByIdAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return Ok(ticket);
        }

        // POST: api/Ticket
        [HttpPost]
        public async Task<ActionResult<TicketDto>> Create([FromBody] TicketDto updateTicketDto)
        {
            var createdTicket = await _ticketService.CreateAsync(updateTicketDto);
            return CreatedAtAction(nameof(GetById), new { id = createdTicket.TicketId }, createdTicket);
        }

        // PUT: api/Ticket/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TicketDto>> Update([FromBody] TicketDto updateTicketDto)
        {
            var updatedTicket = await _ticketService.UpdateAsync(updateTicketDto);

            if (updatedTicket == null)
            {
                return NotFound();
            }

            return Ok(updatedTicket);
        }

        // DELETE: api/Ticket/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<TicketDto>> Delete(int id)
        {
            var deletedTicket = await _ticketService.DeleteAsync(id);

            if (deletedTicket == null)
            {
                return NotFound();
            }

            return Ok(deletedTicket);
        }
    }
}
