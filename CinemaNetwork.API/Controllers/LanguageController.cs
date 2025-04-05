using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/Language")]
    [ApiController]
    public class LanguageController : GenericController<Language, LanguageDto>
    {
        public LanguageController(IService<Language, LanguageDto> service) 
            : base(service)
        {
        }
    }
}
