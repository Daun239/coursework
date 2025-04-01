using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        // GET: api/Movie
        [HttpGet]
        public async Task<ActionResult<List<MovieDto>>> GetAll()
        {
            var movies = await _movieService.GetAllAsync();
            return Ok(movies);
        }

        // GET: api/Movie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDto>> GetById(int id)
        {
            var movie = await _movieService.GetByIdAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            return Ok(movie);
        }

        [HttpPost]
        public async Task<ActionResult<MovieDto>> Create([FromForm] MovieDto movieDto)
        {
            // The mapping logic for converting the file to byte array is handled by the mapper
            var createdMovie = await _movieService.CreateAsync(movieDto);

            return CreatedAtAction(nameof(GetById), new { id = createdMovie.MovieId }, createdMovie);
        }

        // PUT: api/Movie/5
        [HttpPut("{id}")]
        public async Task<ActionResult<MovieDto>> Update(int id, [FromForm] MovieDto movieDto)
        {
            var updatedMovie = await _movieService.UpdateAsync(movieDto);

            if (updatedMovie == null)
            {
                return NotFound();
            }

            return Ok(updatedMovie);
        }

        // DELETE: api/Movie/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MovieDto>> Delete(int id)
        {
            var deletedMovie = await _movieService.DeleteAsync(id);

            if (deletedMovie == null)
            {
                return NotFound();
            }

            return Ok(deletedMovie);
        }
    }
}
