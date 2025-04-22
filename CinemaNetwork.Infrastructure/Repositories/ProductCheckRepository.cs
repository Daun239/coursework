using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductCheckRepository : Repository<ProductCheck>, IProductCheckRepository
    {
        public ProductCheckRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}