using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningService _screeningService;

        public ScreeningController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }

        // GET: api/Screening
        [HttpGet]
        public async Task<ActionResult<List<ScreeningDto>>> GetAll()
        {
            var screenings = await _screeningService.GetAllAsync();
            return Ok(screenings);
        }

        // GET: api/Screening/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScreeningDto>> GetById(int id)
        {
            var screening = await _screeningService.GetByIdAsync(id);

            if (screening == null)
            {
                return NotFound();
            }

            return Ok(screening);
        }

        // POST: api/Screening
        [HttpPost]
        public async Task<ActionResult<ScreeningDto>> Create([FromBody] ScreeningDto updateScreeningDto)
        {
            var createdScreening = await _screeningService.CreateAsync(updateScreeningDto);

            return CreatedAtAction(nameof(GetById), new { id = createdScreening.ScreeningFormatId }, createdScreening);
        }

        // PUT: api/Screening/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ScreeningDto>> Update([FromBody] ScreeningDto updateScreeningDto)
        {
            var updatedScreening = await _screeningService.UpdateAsync(updateScreeningDto);

            if (updatedScreening == null)
            {
                return NotFound();
            }

            return Ok(updatedScreening);
        }

        // DELETE: api/Screening/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ScreeningDto>> Delete(int id)
        {
            var deletedScreening = await _screeningService.DeleteAsync(id);

            if (deletedScreening == null)
            {
                return NotFound();
            }

            return Ok(deletedScreening);
        }
    }
}
