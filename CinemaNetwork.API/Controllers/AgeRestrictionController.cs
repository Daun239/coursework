
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/AgeRestriction")]
    [ApiController]
    public class AgeRestrictionController : GenericController<AgeRestriction, AgeRestrictionDto>
    {
        public AgeRestrictionController(IService<AgeRestriction, AgeRestrictionDto> service)
            : base(service)
        {


        }
        [HttpGet("all")]
        // [Authorize(Roles = "Admin,Manager")]
        public override async Task<ActionResult<List<AgeRestrictionDto>>> GetAll(string? dynamicFilter, string? sortBy, int page = 1, int pageSize = 10)
        {
            return await base.GetAll(dynamicFilter, sortBy, page, pageSize);
        }

    }
}
