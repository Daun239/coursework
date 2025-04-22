using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Services
{
    public class ProductInOrderService : Service<ProductsInOrder, ProductsInOrderDto>, IProductInOrderService
    {
        public ProductInOrderService(IRepository<ProductsInOrder> repository, IMapper mapper)
            : base(repository, mapper)
        {
        }
    }
}
