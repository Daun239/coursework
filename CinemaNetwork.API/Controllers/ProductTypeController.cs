using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ProductType")]
    [ApiController]
    public class ProductTypeController : GenericController<ProductType, ProductTypeDto>
    {
        public ProductTypeController(IService<ProductType, ProductTypeDto> service) 
            : base(service)
        {
        }
    }
}
