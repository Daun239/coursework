using System.Net.Mail;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Interfaces_Services
{
    public interface IDeliveryOrderService : IService<DeliveryOrder, DeliveryOrderDto>
    {
         
    }
}