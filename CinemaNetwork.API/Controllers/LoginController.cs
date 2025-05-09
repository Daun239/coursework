using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CinemaNetwork.Infrastructure.Models;
using CinemaNetwork.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;

namespace CinemaNetwork.API.Controllers
{
    [ApiController]
    [Route("api/login")]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly CinemaNetworkContext _context;
        private readonly IPasswordHasher<Employee> _passwordHasher;

        public LoginController(CinemaNetworkContext context, IConfiguration configuration, IPasswordHasher<Employee> passwordHasher)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = passwordHasher;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var employee = await _context.Employees
    .Include(e => e.EmployeePosition).Include(e => e.EmployeePassword)
    .Include(e => e.Cinema)
        .ThenInclude(c => c.City)
    .FirstOrDefaultAsync(e => e.Email == request.Email);


            if (employee == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            if (employee.EmployeePassword.Password != request.Password)
            {
                return Unauthorized("Invalid email or password.");
            }


            // Get role from EmployeePosition
            var role = employee.EmployeePosition.EmployeePosition1;
            if (string.IsNullOrEmpty(role))
            {
                return Unauthorized("Employee role not found.");
            }

            // Generate JWT
            var token = GenerateToken(
                employee.EmployeeId.ToString(),
                employee.Email,
                role,
                employee.Name,
                employee.Surname,
                employee.CellNumber,
                employee.CinemaId.ToString(),
                employee.Cinema.Name,
                employee.EmployeePosition.EmployeePosition1.ToString(),
                employee.Cinema.City.City1.ToString()
            );

            // Return token and user info
            return Ok(new
            {
                token,
                employee = new
                {
                    id = employee.EmployeeId,
                    email = employee.Email,
                    name = employee.Name,
                    surname = employee.Surname,
                    cellNumber = employee.CellNumber,
                    role
                }
            });
        }

        private string GenerateToken(string userId, string email, string role, string name, string surname, string phone, string cinemaId, string cinemaName, string employeePosition, string cityName)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JWTSettings:Key"]);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Sub, userId),
                new(JwtRegisteredClaimNames.Email, email),
                new("role", role),
                new("name", name),
                new("surname", surname),
                new("cellNumber", phone),
                new("cinemaId", cinemaId),
                new ("cinemaName", cinemaName),
                new ("employeePosition", employeePosition),
                new ("cityName", cityName),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60),
                Issuer = _configuration["JWTSettings:Issuer"],
                Audience = _configuration["JWTSettings:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
