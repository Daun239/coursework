using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
    public interface IPaymentMethodRepository
    {
        Task<List<PaymentMethod>> GetAllAsync();
        Task<PaymentMethod?> GetByIdAsync(int id);
        Task<PaymentMethod> CreateAsync(string paymentMethod);
        Task<PaymentMethod?> UpdateAsync(int id, string paymentMethod);
        Task<PaymentMethod?> DeleteAsync(int id);
    }
}