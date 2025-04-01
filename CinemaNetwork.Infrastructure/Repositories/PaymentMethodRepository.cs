using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class PaymentMethodRepository : IPaymentMethodRepository
    {
        private readonly CinemaNetworkContext _context;

        public PaymentMethodRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all payment methods
        public async Task<List<PaymentMethod>> GetAllAsync()
        {
            return await _context.PaymentMethods.ToListAsync();
        }

        // Get a payment method by ID
        public async Task<PaymentMethod?> GetByIdAsync(int id)
        {
            return await _context.PaymentMethods.FirstOrDefaultAsync(pm => pm.PaymentMethodId == id);
        }

        // Create a new payment method
        public async Task<PaymentMethod> CreateAsync(string paymentMethod)
        {
            var newPaymentMethod = new PaymentMethod
            {
                PaymentMethod1 = paymentMethod
            };

            _context.PaymentMethods.Add(newPaymentMethod);
            await _context.SaveChangesAsync();
            return newPaymentMethod;
        }

        // Update an existing payment method
        public async Task<PaymentMethod?> UpdateAsync(int id, string paymentMethod)
        {
            var existingPaymentMethod = await _context.PaymentMethods.FirstOrDefaultAsync(pm => pm.PaymentMethodId == id);
            if (existingPaymentMethod == null)
            {
                return null; // Return null if not found
            }

            // Update the payment method's name
            existingPaymentMethod.PaymentMethod1 = paymentMethod;

            await _context.SaveChangesAsync();
            return existingPaymentMethod;
        }

        // Delete a payment method by ID
        public async Task<PaymentMethod?> DeleteAsync(int id)
        {
            var paymentMethod = await _context.PaymentMethods.FirstOrDefaultAsync(pm => pm.PaymentMethodId == id);
            if (paymentMethod == null)
            {
                return null; // Return null if not found
            }

            _context.PaymentMethods.Remove(paymentMethod);
            await _context.SaveChangesAsync();
            return paymentMethod;
        }
    }
}
