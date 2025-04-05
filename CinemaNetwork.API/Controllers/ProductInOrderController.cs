using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ProductInOrder")]
    [ApiController]
    public class ProductInOrderController : GenericController<ProductsInOrder, ProductsInOrderDto>
    {
        public ProductInOrderController(IService<ProductsInOrder, ProductsInOrderDto> service) 
            : base(service)
        {
        }
    }
}
