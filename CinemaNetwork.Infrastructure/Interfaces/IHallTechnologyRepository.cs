using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IHallTechnologyRepository
    {
        Task<List<HallTechnology>> GetAllAsync();
        Task<HallTechnology?> GetByIdAsync(int id);
        Task<HallTechnology> CreateAsync(string hallTechnology);
        Task<HallTechnology?> UpdateAsync(int id, string hallTechnology);
        Task<HallTechnology?> DeleteAsync(int id);
    }
}