using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScreeningFormatController : ControllerBase
    {
        private readonly IScreeningFormatService _screeningFormatService;

        public ScreeningFormatController(IScreeningFormatService screeningFormatService)
        {
            _screeningFormatService = screeningFormatService;
        }

        // GET: api/ScreeningFormat
        [HttpGet]
        public async Task<ActionResult<List<ScreeningFormat>>> GetAll()
        {
            var screeningFormats = await _screeningFormatService.GetAllAsync();
            return Ok(screeningFormats);
        }

        // GET: api/ScreeningFormat/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ScreeningFormat>> GetById(int id)
        {
            var screeningFormat = await _screeningFormatService.GetByIdAsync(id);

            if (screeningFormat == null)
            {
                return NotFound();
            }

            return Ok(screeningFormat);
        }

        // POST: api/ScreeningFormat
        [HttpPost]
        public async Task<ActionResult<ScreeningFormat>> Create([FromBody] ScreeningFormatDto screeningFormat)
        {
            var createdScreeningFormat = await _screeningFormatService.CreateAsync(screeningFormat);

            return CreatedAtAction(nameof(GetById), new { id = createdScreeningFormat.ScreeningFormatId }, createdScreeningFormat);
        }

        // PUT: api/ScreeningFormat/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ScreeningFormat>> Update([FromBody] ScreeningFormatDto screeningFormat)
        {
            var updatedScreeningFormat = await _screeningFormatService.UpdateAsync(screeningFormat);

            if (updatedScreeningFormat == null)
            {
                return NotFound();
            }

            return Ok(updatedScreeningFormat);
        }

        // DELETE: api/ScreeningFormat/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<ScreeningFormat>> Delete(int id)
        {
            var deletedScreeningFormat = await _screeningFormatService.DeleteAsync(id);

            if (deletedScreeningFormat == null)
            {
                return NotFound();
            }

            return Ok(deletedScreeningFormat);
        }
    }
}
