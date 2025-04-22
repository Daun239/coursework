using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class HallTechnologyRepository : Repository<HallTechnology>, IHallTechnologyRepository
    {
        public HallTechnologyRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
