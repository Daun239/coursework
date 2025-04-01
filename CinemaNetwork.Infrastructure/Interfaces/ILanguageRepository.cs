using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface ILanguageRepository
    {
        Task<List<Language>> GetAllAsync();
        Task<Language?> GetByIdAsync(int id);
        Task<Language> CreateAsync(string language);
        Task<Language?> UpdateAsync(int id, string language);
        Task<Language?> DeleteAsync(int id);
    }
}