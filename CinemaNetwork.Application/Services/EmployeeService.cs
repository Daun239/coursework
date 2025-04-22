using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace CinemaNetwork.Services
{
    public class EmployeeService : Service<Employee, EmployeeDto>, IEmployeeService
    {
        private readonly IRepository<Employee> _employeeRepository;
        private readonly IPasswordHasher<Employee> _passwordHasher;
        private readonly ILogger<EmployeeService> _logger;
        private readonly IMapper _mapper;

        public EmployeeService(
            IRepository<Employee> employeeRepository,
            IPasswordHasher<Employee> passwordHasher, 
            ILogger<EmployeeService> logger,
            IMapper mapper
        ) : base(employeeRepository, mapper)
        {
            _employeeRepository = employeeRepository;
            _passwordHasher = passwordHasher;
            _logger = logger;
            _mapper = mapper;
        }

        // Create new employee with password hashing
        public override async Task<EmployeeDto> CreateAsync(EmployeeDto employeeDto)
        {
            var employee = _mapper.Map<Employee>(employeeDto);

            if (string.IsNullOrWhiteSpace(employeeDto.Password))
            {
                _logger.LogWarning("Password is empty or null.");
                return null;
            }

            // Hash the password only if it's provided
            employee.PasswordHash = _passwordHasher.HashPassword(employee, employeeDto.Password);

            if (string.IsNullOrWhiteSpace(employee.PasswordHash))
            {
                _logger.LogError("Password hashing failed.");
                return null;
            }

            await _employeeRepository.AddAsync(employee); // Use the repository to add the employee

            _logger.LogInformation($"Employee Created: ID={employee.EmployeeId}, Name={employee.Name}");
            return _mapper.Map<EmployeeDto>(employee); // Return the employee DTO
        }

        // Update employee details, including optional password change
        public override async Task<EmployeeDto> UpdateAsync(EmployeeDto employeeDto)
        {
            var existingEmployee = await _employeeRepository.GetByIdAsync(employeeDto.EmployeeId);

            if (existingEmployee == null)
            {
                _logger.LogWarning($"Employee with ID={employeeDto.EmployeeId} not found.");
                return null;
            }

            _mapper.Map(employeeDto, existingEmployee);

            // Update password if provided
            if (!string.IsNullOrWhiteSpace(employeeDto.Password))
            {
                existingEmployee.PasswordHash = _passwordHasher.HashPassword(existingEmployee, employeeDto.Password);
                _logger.LogInformation($"Password updated and hashed for Employee ID={existingEmployee.EmployeeId}");
            }

            await _employeeRepository.UpdateAsync(existingEmployee); // Save the changes

            _logger.LogInformation($"Employee Updated: ID={existingEmployee.EmployeeId}, Name={existingEmployee.Name}");

            return _mapper.Map<EmployeeDto>(existingEmployee); // Return the updated employee DTO
        }
    }
}
