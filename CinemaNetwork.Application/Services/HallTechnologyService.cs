using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class HallTechnologyService : Service<HallTechnology, HallTechnologyDto>, IHallTechnologyService
    {
        public HallTechnologyService(IRepository<HallTechnology> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
