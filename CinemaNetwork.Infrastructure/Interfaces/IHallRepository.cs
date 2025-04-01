using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IHallRepository
    {
        Task<List<Hall>> GetAllAsync();
        Task<Hall?> GetByIdAsync(int id);
        Task<Hall> CreateAsync(Hall hall);
        Task<Hall?> UpdateAsync(int id, Hall hall);
        Task<Hall?> DeleteAsync(int id);
    }
}