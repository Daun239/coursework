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

        [HttpGet]
        public async Task<ActionResult<List<TDto>>> GetAll()
        {
            var items = await _service.GetAllAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<TDto>> Create([FromBody] TDto dto)
        {
            var createdItem = await _service.CreateAsync(dto);
            return Ok(createdItem);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TDto>> Update(int id, [FromBody] TDto dto)
        {
            var updatedItem = await _service.UpdateAsync(dto);
            if (updatedItem == null)
            {
                return NotFound();
            }
            return Ok(updatedItem);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<TDto>> Delete(int id)
        {
            var deletedItem = await _service.DeleteAsync(id);
            if (deletedItem == null)
            {
                return NotFound();
            }
            return Ok(deletedItem);
        }

    }
}
