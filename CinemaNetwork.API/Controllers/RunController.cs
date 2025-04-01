using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RunController : ControllerBase
    {
        private readonly IRunService _runService;

        public RunController(IRunService runService)
        {
            _runService = runService;
        }

        // GET: api/Run
        [HttpGet]
        public async Task<ActionResult<List<RunDto>>> GetAll()
        {
            var runs = await _runService.GetAllAsync();
            return Ok(runs);
        }

        // GET: api/Run/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RunDto>> GetById(int id)
        {
            var run = await _runService.GetByIdAsync(id);

            if (run == null)
            {
                return NotFound();
            }

            return Ok(run);
        }

        // POST: api/Run
        [HttpPost]
        public async Task<ActionResult<RunDto>> Create([FromBody] RunDto updateRunDto)
        {
            var createdRun = await _runService.CreateAsync(updateRunDto);

            return CreatedAtAction(nameof(GetById), new { id = createdRun.RunId }, createdRun);
        }

        // PUT: api/Run/5
        [HttpPut("{id}")]
        public async Task<ActionResult<RunDto>> Update([FromBody] RunDto updateRunDto)
        {
            var updatedRun = await _runService.UpdateAsync(updateRunDto);

            if (updatedRun == null)
            {
                return NotFound();
            }

            return Ok(updatedRun);
        }

        // DELETE: api/Run/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<RunDto>> Delete(int id)
        {
            var deletedRun = await _runService.DeleteAsync(id);

            if (deletedRun == null)
            {
                return NotFound();
            }

            return Ok(deletedRun);
        }
    }
}
