namespace CinemaNetwork.Application.Dtos;
    public partial class ProductDto
    {
        public int ProductId { get; set; }

        public int? ProductTypeId { get; set; }

        public int? Price { get; set; }

        public string? Name { get; set; }
    }