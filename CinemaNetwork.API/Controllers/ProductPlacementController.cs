using CinemaNetwork.API.Models;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

namespace CinemaNetwork.Api.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/product-placement")]
    [ApiController]
    public class ProductPlacementController : GenericController<ProductPlacement, ProductPlacementDto>
    {
        public ProductPlacementController(IService<ProductPlacement, ProductPlacementDto> service) 
            : base(service)
        {
        }
    }
}
