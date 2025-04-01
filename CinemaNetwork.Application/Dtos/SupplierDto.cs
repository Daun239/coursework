namespace CinemaNetwork.Application.Dtos;
    public partial class SupplierDto
    {
        public int SupplierId { get; set; }

        public string Name { get; set; } = null!;

        public string Surname { get; set; } = null!;

        public string? CellNumber { get; set; }

        public string? Email { get; set; }

    }