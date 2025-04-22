using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class ProductPlacementService : Service<ProductPlacement, ProductPlacementDto>, IProductPlacementService
    {
        public ProductPlacementService(IRepository<ProductPlacement> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
