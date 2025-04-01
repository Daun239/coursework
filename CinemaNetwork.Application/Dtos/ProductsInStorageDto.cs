namespace CinemaNetwork.Application.Dtos;
    public partial class ProductsInStorageDto
    {
        public int ProductInStorageId { get; set; }

        public int ProductId { get; set; }

        public int CinemaId { get; set; }

        public DateTime? ProductionDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public int? Quantity { get; set; }
    }