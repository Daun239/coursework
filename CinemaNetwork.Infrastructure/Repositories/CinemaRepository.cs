using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class CinemaRepository : Repository<Cinema>, ICinemaRepository
    {
        public CinemaRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
