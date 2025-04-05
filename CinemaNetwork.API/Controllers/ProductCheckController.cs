using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ProductCheck")]
    [ApiController]
    public class ProductCheckController : GenericController<ProductCheck, ProductCheckDto>
    {
        public ProductCheckController(IService<ProductCheck, ProductCheckDto> service) 
            : base(service)
        {
        }
    }
}
