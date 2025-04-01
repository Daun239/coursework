using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IScreeningFormatRepository
    {
        Task<List<ScreeningFormat>> GetAllAsync();
        Task<ScreeningFormat?> GetByIdAsync(int id);
        Task<ScreeningFormat> CreateAsync(string screeningFormat);
        Task<ScreeningFormat?> UpdateAsync(int id, string screeningFormat);
        Task<ScreeningFormat?> DeleteAsync(int id);
    }
}