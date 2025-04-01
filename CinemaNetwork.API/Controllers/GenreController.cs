using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IGenreService _genreService;

        public GenreController(IGenreService genreService)
        {
            _genreService = genreService;
        }

        // GET: api/genre
        [HttpGet]
        public async Task<ActionResult<List<Genre>>> GetAll()
        {
            var genres = await _genreService.GetAllAsync();
            return Ok(genres);  // Return the list of genres as 200 OK
        }

        // GET: api/genre/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Genre>> GetById(int id)
        {
            var genre = await _genreService.GetByIdAsync(id);
            if (genre == null)
            {
                return NotFound(new { message = "Genre not found" });  // Return 404 if genre not found
            }
            return Ok(genre);  // Return the genre as 200 OK
        }

        // POST: api/genre
        [HttpPost]
        public async Task<ActionResult<Genre>> Create([FromBody] GenreDto genre)
        {
            if (string.IsNullOrEmpty(genre.Genre1))
            {
                return BadRequest(new { message = "Genre name is required" });  // Handle empty input
            }

            var createdGenre = await _genreService.CreateAsync(genre);
            return CreatedAtAction(nameof(GetById), new { id = createdGenre.GenreId }, createdGenre);  // Return 201 Created
        }

        // PUT: api/genre/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<GenreDto>> Update([FromBody] GenreDto genre)
        {
            if (string.IsNullOrEmpty(genre.Genre1))
            {
                return BadRequest(new { message = "Genre name is required" });  // Handle empty input
            }

            var updatedGenre = await _genreService.UpdateAsync(genre);
            if (updatedGenre == null)
            {
                return NotFound(new { message = "Genre not found" });  // Return 404 if genre not found
            }

            return Ok(updatedGenre);  // Return updated genre as 200 OK
        }

        // DELETE: api/genre/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deletedGenre = await _genreService.DeleteAsync(id);
            if (deletedGenre == null)
            {
                return NotFound(new { message = "Genre not found" });  // Return 404 if genre not found
            }

            return NoContent();  // Return 204 No Content to indicate successful deletion
        }
    }
}
