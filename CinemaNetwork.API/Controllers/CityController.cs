using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CityController : ControllerBase
    {
        private readonly ICityService _cityService;

        public CityController(ICityService cityService)
        {
            _cityService = cityService;
        }

        // GET: api/City
        [HttpGet]
        public async Task<ActionResult<List<City>>> GetAllCities()
        {
            var cities = await _cityService.GetAllAsync();
            return Ok(cities);
        }

        // GET: api/City/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCityById(int id)
        {
            var city = await _cityService.GetByIdAsync(id);
            if (city == null)
                return NotFound();

            return Ok(city);
        }

        // POST: api/City
        [HttpPost]
        public async Task<ActionResult<City>> CreateCity([FromBody] CityDto City)
        {
            if (string.IsNullOrWhiteSpace(City.City1))
                return BadRequest("City name cannot be empty.");

            var createdCity = await _cityService.CreateAsync(City);
            return CreatedAtAction(nameof(GetCityById), new { id = createdCity.CityId }, createdCity);
        }

        // PUT: api/City/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<City>> UpdateCity([FromBody] CityDto City)
        {
            if (string.IsNullOrWhiteSpace(City.City1))
                return BadRequest("City name cannot be empty.");

            var updatedCity = await _cityService.UpdateAsync(City);
            if (updatedCity == null)
                return NotFound();

            return Ok(updatedCity);
        }

        // DELETE: api/City/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<City>> DeleteCity(int id)
        {
            var deletedCity = await _cityService.DeleteAsync(id);
            if (deletedCity == null)
                return NotFound();

            return Ok(deletedCity);
        }
    }
}
