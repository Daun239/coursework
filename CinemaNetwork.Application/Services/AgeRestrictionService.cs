using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Interfaces; // Repository Interface
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Services
{
    public class AgeRestrictionService : Service<AgeRestriction, AgeRestrictionDto>, IAgeRestrictionService
    {
        public AgeRestrictionService(IRepository<AgeRestriction> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
