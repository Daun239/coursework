using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class TicketRepository : Repository<Ticket>, ITicketRepository
    {
        public TicketRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
