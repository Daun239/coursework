using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/SeatCategory")]
    [ApiController]
    public class SeatCategoryController : GenericController<SeatCategory, SeatCategoryDto>
    {
        public SeatCategoryController(IService<SeatCategory, SeatCategoryDto> service)
            : base(service)
        {
        }
    }
}
