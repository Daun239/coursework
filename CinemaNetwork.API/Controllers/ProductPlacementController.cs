using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/ProductPlacement")]
    [ApiController]
    public class ProductPlacementController : GenericController<ProductPlacement, ProductPlacementDto>
    {
        public ProductPlacementController(IService<ProductPlacement, ProductPlacementDto> service) 
            : base(service)
        {
        }
    }
}
