using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface ISeatRepository
    {
        Task<List<Seat>> GetAllAsync();
        Task<Seat?> GetByIdAsync(int id);
        Task<Seat> SeatCreateAsync(Seat updateSeatDto);
        Task<Seat?> UpdateAsync(int id, Seat updateSeatDto);
        Task<Seat?> DeleteAsync(int id);
    }
}