using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HallTechnologyController : ControllerBase
    {
        private readonly IHallTechnologyService _hallTechnologyService;

        public HallTechnologyController(IHallTechnologyService hallTechnologyService)
        {
            _hallTechnologyService = hallTechnologyService;
        }

        // GET: api/HallTechnology
        [HttpGet]
        public async Task<ActionResult<List<HallTechnology>>> GetAll()
        {
            var hallTechnologies = await _hallTechnologyService.GetAllAsync();
            return Ok(hallTechnologies);
        }

        // GET: api/HallTechnology/5
        [HttpGet("{id}")]
        public async Task<ActionResult<HallTechnology>> GetById(int id)
        {
            var hallTechnology = await _hallTechnologyService.GetByIdAsync(id);

            if (hallTechnology == null)
            {
                return NotFound();
            }

            return Ok(hallTechnology);
        }

        // POST: api/HallTechnology
        [HttpPost]
        public async Task<ActionResult<HallTechnologyDto>> Create(HallTechnologyDto hallTechnology)
        {
            var createdHallTechnology = await _hallTechnologyService.CreateAsync(hallTechnology);

            return CreatedAtAction(nameof(GetById), new { id = createdHallTechnology.HallTechnologyId }, createdHallTechnology);
        }

        // PUT: api/HallTechnology/5
        [HttpPut("{id}")]
        public async Task<ActionResult<HallTechnology>> Update(HallTechnologyDto hallTechnology)
        {
            var updatedHallTechnology = await _hallTechnologyService.UpdateAsync(hallTechnology);

            if (updatedHallTechnology == null)
            {
                return NotFound();
            }

            return Ok(updatedHallTechnology);
        }

        // DELETE: api/HallTechnology/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<HallTechnology>> Delete(int id)
        {
            var deletedHallTechnology = await _hallTechnologyService.DeleteAsync(id);

            if (deletedHallTechnology == null)
            {
                return NotFound();
            }

            return Ok(deletedHallTechnology);
        }
    }
}
