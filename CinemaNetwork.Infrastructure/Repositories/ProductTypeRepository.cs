using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ProductTypeRepository : Repository<Client>, IClientRepository
    {
        public ProductTypeRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}