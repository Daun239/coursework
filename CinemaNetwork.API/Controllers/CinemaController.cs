using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CinemaController : ControllerBase
    {
        private readonly ICinemaService _cinemaService;

        public CinemaController(ICinemaService cinemaService)
        {
            _cinemaService = cinemaService;
        }

        // GET: api/Cinema
        [HttpGet]
        public async Task<ActionResult<List<CinemaDto>>> GetAllCinemas()
        {
            var cinemas = await _cinemaService.GetAllAsync();
            return Ok(cinemas);
        }

        // GET: api/Cinema/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CinemaDto>> GetCinemaById(int id)
        {
            var cinema = await _cinemaService.GetByIdAsync(id);
            if (cinema == null)
                return NotFound();

            return Ok(cinema);
        }

        // POST: api/Cinema
        [HttpPost]
        public async Task<ActionResult<CinemaDto>> CreateCinema([FromBody] CinemaDto updateCinemaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdCinema = await _cinemaService.CreateAsync(updateCinemaDto);
            return CreatedAtAction(nameof(GetCinemaById), new { id = createdCinema.CinemaId }, createdCinema);
        }

        // PUT: api/Cinema/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CinemaDto>> UpdateCinema([FromBody] CinemaDto updateCinemaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedCinema = await _cinemaService.UpdateAsync(updateCinemaDto);
            if (updatedCinema == null)
                return NotFound();

            return Ok(updatedCinema);
        }

        // DELETE: api/Cinema/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<CinemaDto>> DeleteCinema(int id)
        {
            var deletedCinema = await _cinemaService.DeleteAsync(id);
            if (deletedCinema == null)
                return NotFound();

            return Ok(deletedCinema);
        }
    }
}
