using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class RunService : Service<Run, RunDto>, IRunService
    {
        public RunService(IRepository<Run> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
