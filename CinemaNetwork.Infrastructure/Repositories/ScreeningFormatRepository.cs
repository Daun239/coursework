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
    public class ScreeningFormatRepository : Repository<ScreeningFormat>, IScreeningFormatRepository
    {
        public ScreeningFormatRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}
