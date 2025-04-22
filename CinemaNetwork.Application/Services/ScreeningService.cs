using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class ScreeningService : Service<Screening, ScreeningDto>, IScreeningService
    {
        public ScreeningService(IRepository<Screening> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
