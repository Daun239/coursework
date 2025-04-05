
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

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
    }
}
