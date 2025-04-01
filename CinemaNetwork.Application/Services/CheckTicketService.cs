using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
     public class CheckTicketService : Service<CheckTicket, CheckTicketDto> , ICheckTicketService
    {

        public CheckTicketService(CinemaNetworkContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
