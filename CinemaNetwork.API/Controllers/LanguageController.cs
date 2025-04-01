using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LanguageController : ControllerBase
    {
        private readonly ILanguageService _languageService;

        public LanguageController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        // GET: api/Language
        [HttpGet]
        public async Task<ActionResult<List<LanguageDto>>> GetAll()
        {
            var languages = await _languageService.GetAllAsync();
            return Ok(languages);
        }

        // GET: api/Language/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LanguageDto>> GetById(int id)
        {
            var language = await _languageService.GetByIdAsync(id);

            if (language == null)
            {
                return NotFound();
            }

            return Ok(language);
        }

        // POST: api/Language
        [HttpPost]
        public async Task<ActionResult<Language>> Create(LanguageDto language)
        {
            var createdLanguage = await _languageService.CreateAsync(language);

            return CreatedAtAction(nameof(GetById), new { id = createdLanguage.LanguageId }, createdLanguage);
        }

        // PUT: api/Language/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Language>> Update(LanguageDto language)
        {
            var updatedLanguage = await _languageService.UpdateAsync(language);

            if (updatedLanguage == null)
            {
                return NotFound();
            }

            return Ok(updatedLanguage);
        }

        // DELETE: api/Language/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Language>> Delete(int id)
        {
            var deletedLanguage = await _languageService.DeleteAsync(id);

            if (deletedLanguage == null)
            {
                return NotFound();
            }

            return Ok(deletedLanguage);
        }
    }
}
