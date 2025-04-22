using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.Infrastructure.Repositories
{
   public class CheckTicketRepository : Repository<CheckTicket> , ICheckTicketRepository
    {
        public CheckTicketRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
