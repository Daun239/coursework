using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductInStorageRepository : Repository<ProductsInStorage>, IProductInStorageRepository
    {
        public ProductInStorageRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}