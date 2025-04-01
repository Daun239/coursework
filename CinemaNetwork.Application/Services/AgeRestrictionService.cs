using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Services
{
    public class AgeRestrictionService : Service<AgeRestriction, AgeRestrictionDto>, IAgeRestrictionService
    {
        public AgeRestrictionService(CinemaNetworkContext context, IMapper mapper)
            : base(context, mapper)
        {
        }
    }
}
