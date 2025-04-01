using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface ITicketRepository
    {
        Task<List<Ticket>> GetAllAsync();
        Task<Ticket?> GetByIdAsync(int id);
        Task<Ticket> CreateAsync(Ticket updateTicketDto);
        Task<Ticket?> UpdateAsync(int id, Ticket updateTicketDto);
        Task<Ticket?> DeleteAsync(int id);
    }
}