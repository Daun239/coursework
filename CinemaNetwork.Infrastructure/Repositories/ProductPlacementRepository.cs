using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductPlacementRepository : Repository<ProductPlacement>, IProductPlacementRepository
    {
        public ProductPlacementRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}