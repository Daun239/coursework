using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class AgeRestrictionRepository : Repository<AgeRestriction>, IAgeRestrictionRepository
    {
        public AgeRestrictionRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
