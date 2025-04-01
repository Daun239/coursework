using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HallController : ControllerBase
    {
        private readonly IHallService _hallService;

        // Constructor to inject the HallService
        public HallController(IHallService hallService)
        {
            _hallService = hallService;
        }

        // GET: api/hall
        [HttpGet]
        public async Task<ActionResult<List<HallDto>>> GetAllAsync()
        {
            var halls = await _hallService.GetAllAsync();
            return Ok(halls); // Return the list of HallDto
        }

        // GET: api/hall/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<HallDto>> GetByIdAsync(int id)
        {
            var hall = await _hallService.GetByIdAsync(id);
            if (hall == null)
                return NotFound();

            return Ok(hall); // Return the found HallDto
        }

        // POST: api/hall
        [HttpPost]
        public async Task<ActionResult<HallDto>> CreateAsync([FromBody] HallDto updateHallDto)
        {
            if (updateHallDto == null)
                return BadRequest("Hall data cannot be null.");

            var createdHall = await _hallService.CreateAsync(updateHallDto);
            return CreatedAtAction(nameof(GetByIdAsync), new { id = createdHall.HallId }, createdHall);
            // Assuming that HallDto contains an Id and the created hall is returned
        }

        // PUT: api/hall/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<HallDto>> UpdateAsync(int id, [FromBody] HallDto updateHallDto)
        {
            if (updateHallDto == null)
                return BadRequest("Hall data cannot be null.");

            var updatedHall = await _hallService.UpdateAsync(updateHallDto);
            if (updatedHall == null)
                return NotFound();

            return Ok(updatedHall); // Return the updated HallDto
        }

        // DELETE: api/hall/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAsync(int id)
        {
            var hall = await _hallService.DeleteAsync(id);
            if (hall == null)
                return NotFound();

            return NoContent(); // Return 204 No Content to indicate successful deletion
        }
    }
}
