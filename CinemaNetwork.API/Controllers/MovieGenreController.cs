using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieGenreController : ControllerBase
    {
        private readonly IMovieGenreService _movieGenreService;

        public MovieGenreController(IMovieGenreService movieGenreService)
        {
            _movieGenreService = movieGenreService;
        }

        // GET: api/MovieGenre
        [HttpGet]
        public async Task<ActionResult<List<MovieGenreDto>>> GetAll()
        {
            var movieGenres = await _movieGenreService.GetAllAsync();
            return Ok(movieGenres);
        }

        // GET: api/MovieGenre/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MovieGenreDto>> GetById(int id)
        {
            var movieGenre = await _movieGenreService.GetByIdAsync(id);

            if (movieGenre == null)
            {
                return NotFound();
            }

            return Ok(movieGenre);
        }

        // POST: api/MovieGenre
        [HttpPost]
        public async Task<ActionResult<MovieGenreDto>> Create(MoviesGenreDto movieGenreDto)
        {
            var createdMovieGenre = await _movieGenreService.CreateAsync(movieGenreDto);

            return CreatedAtAction(nameof(GetById), new { id = createdMovieGenre.MoviesGenresId }, createdMovieGenre);
        }

        // PUT: api/MovieGenre/5
        [HttpPut("{id}")]
        public async Task<ActionResult<MovieGenreDto>> Update(MoviesGenreDto movieGenreDto)
        {
            var updatedMovieGenre = await _movieGenreService.UpdateAsync(movieGenreDto);

            if (updatedMovieGenre == null)
            {
                return NotFound();
            }

            return Ok(updatedMovieGenre);
        }

        // DELETE: api/MovieGenre/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<MovieGenreDto>> Delete(int id)
        {
            var deletedMovieGenre = await _movieGenreService.DeleteAsync(id);

            if (deletedMovieGenre == null)
            {
                return NotFound();
            }

            return Ok(deletedMovieGenre);
        }
    }

    public class MovieGenreDto
    {
    }
}
