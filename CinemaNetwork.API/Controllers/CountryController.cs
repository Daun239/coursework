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
    public class CountryController : ControllerBase
    {
        private readonly ICountryService _countryService;

        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        // GET: api/Country
        [HttpGet]
        public async Task<ActionResult<List<Country>>> GetAllCountries()
        {
            var countries = await _countryService.GetAllAsync();
            return Ok(countries);
        }

        // GET: api/Country/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountryById(int id)
        {
            var country = await _countryService.GetByIdAsync(id);
            if (country == null)
                return NotFound();

            return Ok(country);
        }

        // POST: api/Country
        [HttpPost]
        public async Task<ActionResult<Country>> CreateCountry([FromBody] CountryDto Country)
        {
            if (string.IsNullOrWhiteSpace(Country.Country1))
                return BadRequest("Country name cannot be empty.");

            var existingCountries = await _countryService.GetAllAsync(); 

            if (existingCountries.Any(c => c.Country1 == Country.Country1)) {
                return BadRequest($"A country with the name {Country.Country1} already exists");
            }
    
            var createdCountry = await _countryService.CreateAsync(Country);
            return CreatedAtAction(nameof(GetCountryById), new { id = createdCountry.CountryId }, createdCountry);
        }

        // PUT: api/Country/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<Country>> UpdateCountry([FromBody] CountryDto Country)
        {
            if (string.IsNullOrWhiteSpace(Country.Country1))
                return BadRequest("Country name cannot be empty.");

            var updatedCountry = await _countryService.UpdateAsync(Country);
            if (updatedCountry == null)
                return NotFound();

            return Ok(updatedCountry);
        }

        // DELETE: api/Country/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<Country>> DeleteCountry(int id)
        {
            var deletedCountry = await _countryService.DeleteAsync(id);
            if (deletedCountry == null)
                return NotFound();

            return Ok(deletedCountry);
        }
    }
}
