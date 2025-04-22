using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces; // Repository Interface
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class ClientService : Service<Client, ClientDto>, IClientService
    {
        public ClientService(IRepository<Client> repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
