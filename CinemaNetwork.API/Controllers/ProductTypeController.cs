using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.API.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/product-type")]
    [ApiController]
    public class ProductTypeController : GenericController<ProductType, ProductTypeDto>
    {
        public ProductTypeController(IService<ProductType, ProductTypeDto> service) 
            : base(service)
        {
        }
    }
}
