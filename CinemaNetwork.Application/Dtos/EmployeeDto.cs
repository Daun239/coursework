
namespace CinemaNetwork.Application.Dtos;
    public class EmployeeDto
    {
        public int EmployeeId { get; set; }

        public int CinemaId { get; set; }

        public int EmployeePositionId { get; set; }

        public string? Name { get; set; }

        public string? Surname { get; set; }

        public string? CellNumber { get; set; }

        public string? Email { get; set; }

            public string? Password {get; set; } = null!;
    }