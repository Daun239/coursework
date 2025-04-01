using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IRunRepository
    {
        Task<List<Run>> GetAllAsync();
        Task<Run?> GetByIdAsync(int id);
        Task<Run> CreateAsync(Run updateRunDto);
        Task<Run?> UpdateAsync(int id, Run updateRunDto);
        Task<Run?> DeleteAsync(int id);
    }
}