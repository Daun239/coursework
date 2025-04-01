// using System.Text;
// using CinemaNetwork.Application.Interfaces_Services;
// using CinemaNetwork.Infrastructure.Models;
// using Microsoft.AspNetCore.Mvc;

// namespace CinemaNetwork.API.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class MoviePostersController : ControllerBase
//     {
//         private readonly IMoviePosterService _moviePosterService;

//         public MoviePostersController(IMoviePosterService moviePosterService)
//         {
//             _moviePosterService = moviePosterService;
//         }

//         [HttpGet("{id}")]
//         public async Task<ActionResult<MoviePoster>> GetById(int id)
//         {
//             var poster = await _moviePosterService.GetByIdAsync(id);
//             if (poster == null)
//                 return NotFound();

//             // Convert binary data to Base64 for API response
//             if (poster.BinaryImageData != null)
//                 poster.ImageData = Convert.ToBase64String(poster.BinaryImageData);

//             return Ok(poster);
//         }

//         [HttpPost("{movieId}")]
//         public async Task<ActionResult<MoviePoster>> Create(int movieId, [FromBody] MoviePoster poster)
//         {
//             if (!IsBase64String(poster.ImageData))
//             {
//                 return BadRequest("Invalid image data. Please ensure it is base64 encoded.");
//             }

//             // Convert base64 string to byte array for storage
//             poster.BinaryImageData = Convert.FromBase64String(poster.ImageData);

//             var createdPoster = await _moviePosterService.CreateAsync(movieId, poster);
//             return CreatedAtAction(nameof(GetById), new { id = createdPoster.MoviePosterId }, createdPoster);
//         }

//         [HttpPut("{id}")]
//         public async Task<ActionResult<MoviePoster>> Update(int id, [FromBody] MoviePoster updatedPoster)
//         {
//             if (!IsBase64String(updatedPoster.ImageData))
//             {
//                 return BadRequest("Invalid image data. Please ensure it is base64 encoded.");
//             }

//             // Convert base64 string to byte array for storage
//             updatedPoster.BinaryImageData = Convert.FromBase64String(updatedPoster.ImageData);

//             var poster = await _moviePosterService.UpdateAsync(id, updatedPoster);
//             if (poster == null)
//                 return NotFound();

//             return Ok(poster);
//         }

//         private bool IsBase64String(string base64String)
//         {
//             if (string.IsNullOrWhiteSpace(base64String)) return false;

//             try
//             {
//                 Convert.FromBase64String(base64String);
//                 return true;
//             }
//             catch (FormatException)
//             {
//                 return false;
//             }
//         }
//     }
// }
