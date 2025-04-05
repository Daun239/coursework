using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ProductInStorage")]
    [ApiController]
    public class ProductInStorageController : GenericController<ProductsInStorage, ProductsInStorageDto>
    {
        public ProductInStorageController(IService<ProductsInStorage, ProductsInStorageDto> service) 
            : base(service)
        {
        }
    }
}
