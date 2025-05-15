using CinemaNetwork.API.MongoDB;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.API.Controllers
{
    [Route("api/action")]
    [ApiController]
    public class UserActionLogController : ControllerBase
    {
        private readonly UserActionService _userActionService;

        public UserActionLogController(UserActionService userActionService)
        {
            _userActionService = userActionService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserActionLog log)
        {
            if (log == null)
            {
                return BadRequest("Action log is null");
            }

            try
            {
                await _userActionService.LogActionAsync(log);
                return Ok("Action has been logged successfully");
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error has occurred");
            }
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            var result = await _userActionService.GetAllLogs();


            return Ok(result);
        }
    }
}
