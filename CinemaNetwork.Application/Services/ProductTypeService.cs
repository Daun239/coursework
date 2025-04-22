using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class ProductTypeService : Service<ProductType, ProductTypeDto>, IProductTypeService
    {
        public ProductTypeService(IRepository<ProductType> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
