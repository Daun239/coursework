using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        // GET: api/Seat
        [HttpGet]
        public async Task<ActionResult<List<SeatDto>>> GetAll()
        {
            var seats = await _seatService.GetAllAsync();
            return Ok(seats);
        }

        // GET: api/Seat/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SeatDto>> GetById(int id)
        {
            var seat = await _seatService.GetByIdAsync(id);

            if (seat == null)
            {
                return NotFound();
            }

            return Ok(seat);
        }

        // POST: api/Seat
        [HttpPost]
        public async Task<ActionResult<SeatDto>> Create([FromBody] SeatDto updateSeatDto)
        {
            var createdSeat = await _seatService.CreateAsync(updateSeatDto);

            // Assuming 'createdSeat' has relevant data to return
            return Ok(createdSeat);  // Return the created seat without relying on the 'Id' property
        }

        // PUT: api/Seat/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SeatDto>> Update([FromBody] SeatDto updateSeatDto)
        {
            var updatedSeat = await _seatService.UpdateAsync(updateSeatDto);

            if (updatedSeat == null)
            {
                return NotFound();
            }

            return Ok(updatedSeat);
        }

        // DELETE: api/Seat/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SeatDto>> Delete(int id)
        {
            try
            {
                var deletedSeat = await _seatService.DeleteAsync(id);
                return Ok(deletedSeat);
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }
    }
}
