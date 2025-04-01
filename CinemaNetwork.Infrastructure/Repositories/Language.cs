using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class LanguageRepository : ILanguageRepository
    {
        private readonly CinemaNetworkContext _context;

        public LanguageRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all languages
        public async Task<List<Language>> GetAllAsync()
        {
            return await _context.Languages.ToListAsync();
        }

        // Get a language by its ID
        public async Task<Language?> GetByIdAsync(int id)
        {
            return await _context.Languages.FirstOrDefaultAsync(l => l.LanguageId == id);
        }

        // Create a new language
        public async Task<Language> CreateAsync(string language)
        {
            var newLanguage = new Language
            {
                Language1 = language
            };

            await _context.Languages.AddAsync(newLanguage);
            await _context.SaveChangesAsync();

            return newLanguage; // Return the created language
        }

        // Update an existing language
        public async Task<Language?> UpdateAsync(int id, string language)
        {
            var existingLanguage = await _context.Languages.FirstOrDefaultAsync(l => l.LanguageId == id);
            if (existingLanguage == null)
            {
                return null; // Return null if language not found
            }

            existingLanguage.Language1 = language;
            await _context.SaveChangesAsync();

            return existingLanguage; // Return the updated language
        }

        // Delete a language by its ID
        public async Task<Language?> DeleteAsync(int id)
        {
            var language = await _context.Languages.FirstOrDefaultAsync(l => l.LanguageId == id);
            if (language == null)
            {
                return null; // Return null if language not found
            }

            _context.Languages.Remove(language);
            await _context.SaveChangesAsync();

            return language; // Return the deleted language
        }
    }
}
