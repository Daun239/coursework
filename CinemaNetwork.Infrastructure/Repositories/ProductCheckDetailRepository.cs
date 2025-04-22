using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductCheckDetailRepository : Repository<ProductCheckDetail>, IProductCheckDetailRepository
    {
        public ProductCheckDetailRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}