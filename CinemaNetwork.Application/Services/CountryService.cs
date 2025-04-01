using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class CountryService : Service<Country, CountryDto>, ICountryService
    {
        public CountryService(CinemaNetworkContext context, IMapper mapper) : base(context, mapper)
        {
        }
    }
}
