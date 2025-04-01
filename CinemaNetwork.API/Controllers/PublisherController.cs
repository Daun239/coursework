using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.API.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/publisher")]
    [ApiController]
    public class PublisherController : GenericController<Publisher, PublisherDto>
    {
        public PublisherController(IService<Publisher, PublisherDto> service) 
            : base(service)
        {
        }
    }
}
