using System.Collections.Generic;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Interfaces_Services
{
    public interface ICountryService : IService<Country, CountryDto>
    {
    }
}
