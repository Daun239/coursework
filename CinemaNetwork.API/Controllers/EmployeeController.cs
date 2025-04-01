using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Application.Interfaces_Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<List<EmployeeDto>>> GetAllEmployees()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        // GET: api/Employee/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetByIdAsync(id);
            if (employee == null)
                return NotFound();

            return Ok(employee);
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] EmployeeDto updateEmployeeDto)
        {
            if (updateEmployeeDto == null)
                return BadRequest("Invalid data.");

            var createdEmployee = await _employeeService.CreateAsync(updateEmployeeDto);
            return CreatedAtAction(nameof(GetEmployeeById), new { id = createdEmployee.EmployeeId }, createdEmployee);
        }

        // PUT: api/Employee/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<EmployeeDto>> UpdateEmployee([FromBody] EmployeeDto updateEmployeeDto)
        {
            if (updateEmployeeDto == null)
                return BadRequest("Invalid data.");

            var updatedEmployee = await _employeeService.UpdateAsync(updateEmployeeDto);
            if (updatedEmployee == null)
                return NotFound();

            return Ok(updatedEmployee);
        }

        // DELETE: api/Employee/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<EmployeeDto>> DeleteEmployee(int id)
        {
            var deletedEmployee = await _employeeService.DeleteAsync(id);
            if (deletedEmployee == null)
                return NotFound();

            return Ok(deletedEmployee);
        }
    }
}
