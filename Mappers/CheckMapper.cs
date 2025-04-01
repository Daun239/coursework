using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Check;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class CheckMapper
    {
        public static CheckDto ToCheckFromDto(this Check check) {
            return new CheckDto {
                BuyDate = check.BuyDate,
                BuyTime = check.BuyTime,
                Sum = check.Sum,
                EmployeeId = check.EmployeeId,
                PaymentMethodsId = check.PaymentMethodsId,
            };
        }

        
        public static Check ToCheckFromCheckDto(this CheckDto checkDto) {
            return new Check {
                BuyDate = checkDto.BuyDate,
                BuyTime = checkDto.BuyTime,
                ClientId = checkDto.ClientId,
                PaymentMethodsId = checkDto.PaymentMethodsId,
                EmployeeId =  checkDto.EmployeeId,
            };
        }

        public static Check ToCheckFromUpdateDto(this UpdateCheckDto updateCheckDto) {
            return new Check {
                BuyDate = updateCheckDto.BuyDate,
                BuyTime = updateCheckDto.BuyTime,
                ClientId = updateCheckDto.ClientId,
                EmployeeId = updateCheckDto.EmployeeId,
                Sum = updateCheckDto.Sum,
                PaymentMethodsId = updateCheckDto.PaymentMethodsId,
                UpdateDateTime = DateTime.Now,
            };
        }
    }
}