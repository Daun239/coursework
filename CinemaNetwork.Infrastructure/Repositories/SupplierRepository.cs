using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class SupplierRepository : Repository<Supplier>, ISupplierRepository
    {
        public SupplierRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}