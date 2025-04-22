using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ScreeningRepository : Repository<Screening>, IScreeningRepository
    {
        public ScreeningRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
