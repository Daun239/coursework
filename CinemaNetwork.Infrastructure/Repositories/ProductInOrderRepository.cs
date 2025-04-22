using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductInOrderRepository : Repository<ProductsInOrder>, IProductInOrderRepository
    {
        public ProductInOrderRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}