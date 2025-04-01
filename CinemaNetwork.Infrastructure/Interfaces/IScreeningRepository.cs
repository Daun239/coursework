using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IScreeningRepository
    {
        Task<List<Screening>> GetAllAsync();
        Task<Screening?> GetByIdAsync(int id);
        Task<Screening> CreateAsync(Screening updateScreeningDto);
        Task<Screening?> UpdateAsync(Screening updateScreeningDto);
        Task<Screening?> DeleteAsync(int id);
    }
}