using Microsoft.AspNetCore.Mvc;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Application.Dtos;

namespace CinemaNetwork.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMethodController : ControllerBase
    {
        private readonly IPaymentMethodService _paymentMethodService;

        public PaymentMethodController(IPaymentMethodService paymentMethodService)
        {
            _paymentMethodService = paymentMethodService;
        }

        // GET: api/PaymentMethod
        [HttpGet]
        public async Task<ActionResult<List<PaymentMethodDto>>> GetAll()
        {
            var paymentMethods = await _paymentMethodService.GetAllAsync();
            return Ok(paymentMethods);
        }

        // GET: api/PaymentMethod/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentMethodDto>> GetById(int id)
        {
            var paymentMethod = await _paymentMethodService.GetByIdAsync(id);

            if (paymentMethod == null)
            {
                return NotFound();
            }

            return Ok(paymentMethod);
        }

        // POST: api/PaymentMethod
        [HttpPost]
        public async Task<ActionResult<PaymentMethodDto>> Create([FromBody] PaymentMethodDto paymentMethod)
        {
            var createdPaymentMethod = await _paymentMethodService.CreateAsync(paymentMethod);

            return CreatedAtAction(nameof(GetById), new { id = createdPaymentMethod.PaymentMethodId }, createdPaymentMethod);
        }

        // PUT: api/PaymentMethod/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PaymentMethodDto>> Update([FromBody] PaymentMethodDto paymentMethod)
        {
            var updatedPaymentMethod = await _paymentMethodService.UpdateAsync(paymentMethod);

            if (updatedPaymentMethod == null)
            {
                return NotFound();
            }

            return Ok(updatedPaymentMethod);
        }

        // DELETE: api/PaymentMethod/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PaymentMethodDto>> Delete(int id)
        {
            var deletedPaymentMethod = await _paymentMethodService.DeleteAsync(id);

            if (deletedPaymentMethod == null)
            {
                return NotFound();
            }

            return Ok(deletedPaymentMethod);
        }
    }
}
