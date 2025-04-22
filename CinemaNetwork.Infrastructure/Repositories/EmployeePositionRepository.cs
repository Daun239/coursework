using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class EmployeePositionRepository : Repository<EmployeePosition>, IEmployeePositionRepository
    {
        public EmployeePositionRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}