using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.API.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/supplier")]
    [ApiController]
    public class SupplierController : GenericController<Supplier ,SupplierDto>
    {
        public SupplierController(IService<Supplier, SupplierDto> service) 
            : base(service)
        {
        }
    }
}
