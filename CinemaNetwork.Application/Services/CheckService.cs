using AutoMapper;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces; // Repository Interface
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class CheckService : Service<Check, CheckDto>, ICheckService
    {
        public CheckService(IRepository<Check> repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
