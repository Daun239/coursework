using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Product")]
    [ApiController]
    public class ProductController : GenericController<Product, ProductDto>
    {
        public ProductController(IService<Product, ProductDto> service) 
            : base(service)
        {
        }
    }
}
