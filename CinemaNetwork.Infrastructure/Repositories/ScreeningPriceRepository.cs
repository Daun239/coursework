using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ScreeningPriceRepository : Repository<ScreeningPrice>, IScreeningPriceRepository
    {
        public ScreeningPriceRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}