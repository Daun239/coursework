using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublisherController : ControllerBase
    {
        private readonly IPublisherService _publisherService;

        public PublisherController(IPublisherService publisherService)
        {
            _publisherService = publisherService;
        }

        // GET: api/Publisher
        [HttpGet]
        public async Task<ActionResult<List<PublisherDto>>> GetAll()
        {
            var publishers = await _publisherService.GetAllAsync();
            return Ok(publishers);
        }

        // GET: api/Publisher/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PublisherDto>> GetById(int id)
        {
            var publisher = await _publisherService.GetByIdAsync(id);

            if (publisher == null)
            {
                return NotFound();
            }

            return Ok(publisher);
        }

        // POST: api/Publisher
        [HttpPost]
        public async Task<ActionResult<Publisher>> Create([FromBody] PublisherDto publisher)
        {
            var createdPublisher = await _publisherService.CreateAsync(publisher);

            return CreatedAtAction(nameof(GetById), new { id = createdPublisher.PublisherId }, createdPublisher);
        }

        // PUT: api/Publisher/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PublisherDto>> Update([FromBody] PublisherDto publisher)
        {
            var updatedPublisher = await _publisherService.UpdateAsync(publisher);

            if (updatedPublisher == null)
            {
                return NotFound();
            }

            return Ok(updatedPublisher);
        }

        // DELETE: api/Publisher/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PublisherDto>> Delete(int id)
        {
            var deletedPublisher = await _publisherService.DeleteAsync(id);

            if (deletedPublisher == null)
            {
                return NotFound();
            }

            return Ok(deletedPublisher);
        }
    }
}
