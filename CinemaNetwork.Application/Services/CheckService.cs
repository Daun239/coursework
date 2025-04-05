using AutoMapper;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class CheckService : Service<Check, CheckDto> , ICheckService
    {

        public CheckService(CinemaNetworkContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
