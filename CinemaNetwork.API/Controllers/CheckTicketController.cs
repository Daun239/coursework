using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckTicketController : ControllerBase
    {
        private readonly ICheckTicketService _checkTicketService;

        public CheckTicketController(ICheckTicketService checkTicketService)
        {
            _checkTicketService = checkTicketService;
        }

        // GET: api/CheckTicket
        [HttpGet]
        public async Task<ActionResult<List<CheckTicketDto>>> GetAllCheckTickets()
        {
            var checkTickets = await _checkTicketService.GetAllAsync();
            return Ok(checkTickets);
        }

        // GET: api/CheckTicket/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CheckTicketDto>> GetCheckTicketById(int id)
        {
            var checkTicket = await _checkTicketService.GetByIdAsync(id);
            if (checkTicket == null)
                return NotFound();

            return Ok(checkTicket);
        }

        // POST: api/CheckTicket
        [HttpPost]
        public async Task<ActionResult<CheckTicketDto>> CreateCheckTicket([FromBody] CheckTicketDto updateCheckTicketDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdCheckTicket = await _checkTicketService.CreateAsync(updateCheckTicketDto);
            if (createdCheckTicket == null)
                return BadRequest("Failed to create CheckTicket.");

            return CreatedAtAction(nameof(GetCheckTicketById), new { id = createdCheckTicket.CheckTicketId }, createdCheckTicket);
        }

        // PUT: api/CheckTicket/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CheckTicketDto>> UpdateCheckTicket([FromBody] CheckTicketDto updateCheckTicketDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedCheckTicket = await _checkTicketService.UpdateAsync(updateCheckTicketDto);
            if (updatedCheckTicket == null)
                return NotFound();

            return Ok(updatedCheckTicket);
        }

        // DELETE: api/CheckTicket/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<CheckTicketDto>> DeleteCheckTicket(int id)
        {
            var deletedCheckTicket = await _checkTicketService.DeleteAsync(id);
            if (deletedCheckTicket == null)
                return NotFound();

            return Ok(deletedCheckTicket);
        }
    }
}
