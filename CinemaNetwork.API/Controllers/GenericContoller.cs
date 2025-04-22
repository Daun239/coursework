using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericController<TEntity, TDto> : ControllerBase
        where TEntity : class
        where TDto : class
    {
        private readonly IService<TEntity, TDto> _service;

        public GenericController(IService<TEntity, TDto> service)
        {
            _service = service;
        }

        [HttpGet("all")]
        public virtual async Task<ActionResult<List<TDto>>> GetAll(
            [FromQuery] string? dynamicFilter = null,
            [FromQuery] string? sortBy = null, 
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )

        {
            var items = await _service.GetAllAsync(dynamicFilter, sortBy, page, pageSize);
            return Ok(items);
        }

        [HttpGet("count")]
        public virtual async Task<ActionResult<List<TDto>>> GetCount(
            [FromQuery] string? dynamicFilter = null
        )
        
        {
            var items = await _service.GetCountAsync(dynamicFilter);
            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult<TDto>> Create([FromBody] TDto dto)
        {
            var createdItem = await _service.CreateAsync(dto);
            return Ok(createdItem);
        }

        [HttpPut]
        public async Task<ActionResult<TDto>> Update([FromBody] TDto dto)
        {
            var updatedItem = await _service.UpdateAsync(dto);
            if (updatedItem == null)
            {
                return NotFound();
            }
            return Ok(updatedItem);
        }
        [HttpDelete]
        public async Task<ActionResult<List<TDto>>> Delete([FromQuery] string? dynamicFilter)
        {
            var deletedItem = await _service.DeleteAsync(dynamicFilter);
            if (deletedItem == null)
            {
                return NotFound();
            }
            return Ok(deletedItem);
        }
    }
}
