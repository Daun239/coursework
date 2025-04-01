using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AgeRestrictionController : ControllerBase
    {
        private readonly IAgeRestrictionService _ageRestrictionService;

        public AgeRestrictionController(IAgeRestrictionService ageRestrictionService)
        {
            _ageRestrictionService = ageRestrictionService;
        }

        // GET: api/AgeRestriction
        [HttpGet]
        public async Task<ActionResult<List<AgeRestrictionDto>>> GetAll()
        {
            var ageRestrictions = await _ageRestrictionService.GetAllAsync();
            return Ok(ageRestrictions);
        }

        // GET: api/AgeRestriction/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AgeRestrictionDto>> GetById(int id)
        {
            var ageRestriction = await _ageRestrictionService.GetByIdAsync(id);

            if (ageRestriction == null)
            {
                return NotFound($"AgeRestriction with ID {id} not found.");
            }

            return Ok(ageRestriction);
        }

        // POST: api/AgeRestriction
        [HttpPost]
        public async Task<ActionResult<AgeRestrictionDto>> Create([FromBody] AgeRestrictionDto restriction)
        {
            if (restriction.AgeRestriction1 <= 0)
            {
                return BadRequest("Restriction value must be greater than 0.");
            }

            var ageRestriction = await _ageRestrictionService.CreateAsync(restriction);
            return CreatedAtAction(nameof(GetById), new { id = ageRestriction.AgeRestrictionId }, ageRestriction);
        }

        // PUT: api/AgeRestriction/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<AgeRestrictionDto>> Update([FromBody] AgeRestrictionDto restriction)
        {
            if (restriction.AgeRestriction1 <= 0)
            {
                return BadRequest("Restriction value must be greater than 0.");
            }

            var updatedAgeRestriction = await _ageRestrictionService.UpdateAsync(restriction);

            if (updatedAgeRestriction == null)
            {
                return NotFound($"AgeRestriction with ID {restriction.AgeRestrictionId} not found.");
            }

            return Ok(updatedAgeRestriction);
        }

        // DELETE: api/AgeRestriction/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<AgeRestriction>> Delete(int id)
        {
            var deletedAgeRestriction = await _ageRestrictionService.DeleteAsync(id);

            if (deletedAgeRestriction == null)
            {
                return NotFound($"AgeRestriction with ID {id} not found.");
            }

            return Ok(deletedAgeRestriction);
        }
    }
}
