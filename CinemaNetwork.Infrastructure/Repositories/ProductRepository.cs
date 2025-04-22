using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}