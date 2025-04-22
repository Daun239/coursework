using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Repositories
{
     public class ClientRepository : Repository<Client>, IClientRepository
    {
        public ClientRepository(CinemaNetworkContext context) : base(context)
        {
        }
    }
}