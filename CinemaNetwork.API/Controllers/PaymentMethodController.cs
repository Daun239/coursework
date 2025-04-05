using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/PaymentMethod")]
    [ApiController]
    public class PaymentMethodController : GenericController<PaymentMethod, PaymentMethodDto>
    {
        public PaymentMethodController(IService<PaymentMethod, PaymentMethodDto> service) 
            : base(service)
        {
        }
    }
}
