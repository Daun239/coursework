using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces; // Repository Interface
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class CityService : Service<City, CityDto>, ICityService
    {
        public CityService(IRepository<City> repository, IMapper mapper) : base(repository, mapper)
        {
        }
    }
}
