using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Employee;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class EmployeeMapper
    {
        public static Employee toEmployeeFromDto(this EmployeeDto employeeDto)
        {
            return new Employee
            {
                Name = employeeDto.Name,
                Surname = employeeDto.Surname,
                Email = employeeDto.Email,
                CellNumber = employeeDto.CellNumber,
            };
        }
        public static EmployeeDto toDtoFromEmployee(this Employee employee)
        {
            return new EmployeeDto
            {
                Name = employee.Name,
                Surname = employee.Surname,
                Email = employee.Email,
                CellNumber = employee.CellNumber,
            };
        }

        public static Employee toEmployeeFromUpdateDto(this UpdateEmployeeDto updateEmployeeDto) {
              return new Employee
            {
                Name = updateEmployeeDto.Name,
                Surname = updateEmployeeDto.Surname,
                Email = updateEmployeeDto.Email,
                CellNumber = updateEmployeeDto.CellNumber,
            };
        }
    }
}