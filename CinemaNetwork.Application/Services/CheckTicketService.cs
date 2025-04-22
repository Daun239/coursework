using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces; // Repository Interface
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class CheckTicketService : Service<CheckTicket, CheckTicketDto>, ICheckTicketService
    {
        public CheckTicketService(IRepository<CheckTicket> repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
