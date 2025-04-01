using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class CheckRepository : Repository<Check> , ICheckRepository
    {
        public CheckRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
