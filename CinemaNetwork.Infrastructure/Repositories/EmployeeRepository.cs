using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class EmployeeRepository : Repository<Employee>
    // IEmployeeRepository
    {
        private readonly CinemaNetworkContext _context;

        public EmployeeRepository(CinemaNetworkContext context) : base(context)
        {
            _context = context;
        }

        // Get all employees (returns entities)
        public async Task<List<Employee>> GetAllAsync()
        {
            return await _context.Employees.ToListAsync();
        }

        // Get employee by Id (returns entity)
        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
        }

        // Create a new employee (returns entity)
        public async Task<Employee> AddAsync(Employee updateEmployeeDto)
        {
            var addedEmployee = await _context.Employees.AddAsync(updateEmployeeDto);
            await _context.SaveChangesAsync();
            return addedEmployee.Entity; // Return the created entity
        }

        // Update an existing employee (returns entity)
        public async Task<Employee?> UpdateAsync(int id, Employee updateEmployeeDto)
        {
            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
            if (existingEmployee == null)
            {
                return null; // Employee not found
            }

            // Update properties (you can customize which properties to update)
            existingEmployee.Name = updateEmployeeDto.Name;
            existingEmployee.Surname = updateEmployeeDto.Surname;
            existingEmployee.CinemaId = updateEmployeeDto.CinemaId;
            existingEmployee.Email = updateEmployeeDto.Email;

            // Save changes
            await _context.SaveChangesAsync();
            return existingEmployee; // Return updated entity
        }

        // Delete an employee by Id (returns entity)
        public async Task<Employee?> DeleteAsync(int id)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
            if (employee == null)
            {
                return null; // Employee not found
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return employee; // Return deleted entity
        }
    }
}
