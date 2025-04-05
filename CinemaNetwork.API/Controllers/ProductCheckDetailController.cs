using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/ProductCheckDetail")]
    [ApiController]
    public class ProductCheckDetailController : GenericController<ProductCheckDetail, ProductCheckDetailDto>
    {
        public ProductCheckDetailController(IService<ProductCheckDetail, ProductCheckDetailDto> service) 
            : base(service)
        {
        }
    }
}
