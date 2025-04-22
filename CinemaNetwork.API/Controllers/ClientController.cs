
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/client")]
    [ApiController]
    public class ClientCotroller : GenericController<Client, ClientDto>
    {
        public ClientCotroller(IService<Client, ClientDto> service) 
            : base(service)
        {
        }
    }
}
