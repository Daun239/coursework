using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.API.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/seat")]
    [ApiController]
    public class SeatController : GenericController<Seat, SeatDto>
    {
        public SeatController(IService<Seat, SeatDto> service) 
            : base(service)
        {
        }
    }
}
