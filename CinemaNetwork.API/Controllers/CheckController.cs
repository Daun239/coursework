using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckController : ControllerBase
    {
        private readonly ICheckService _checkService;

        public CheckController(ICheckService checkService)
        {
            _checkService = checkService;
        }

        // GET: api/Check
        [HttpGet]
        public async Task<ActionResult<List<CheckDto>>> GetAllChecks()
        {
            var checks = await _checkService.GetAllAsync();
            return Ok(checks);
        }

        // GET: api/Check/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CheckDto>> GetCheckById(int id)
        {
            var check = await _checkService.GetByIdAsync(id);
            if (check == null)
                return NotFound();

            return Ok(check);
        }

        // POST: api/Check
        [HttpPost]
        public async Task<ActionResult<CheckDto>> CreateCheck([FromBody] CheckDto updateCheckDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdCheck = await _checkService.CreateAsync(updateCheckDto);
            return CreatedAtAction(nameof(GetCheckById), new { id = createdCheck.CheckId }, createdCheck);
        }

        // PUT: api/Check/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<CheckDto>> UpdateCheck([FromBody] CheckDto updateCheckDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedCheck = await _checkService.UpdateAsync(updateCheckDto);
            if (updatedCheck == null)
                return NotFound();

            return Ok(updatedCheck);
        }

        // DELETE: api/Check/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<CheckDto>> DeleteCheck(int id)
        {
            var deletedCheck = await _checkService.DeleteAsync(id);
            if (deletedCheck == null)
                return NotFound();

            return Ok(deletedCheck);
        }
    }
}
