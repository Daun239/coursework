namespace CinemaNetwork.Application.Dtos;

    public partial class ProductPlacementDto
    {
        public int ProductPlacementId { get; set; }

        public int EmployeeId { get; set; }

        public int ProductInStorageId { get; set; }

        public int ProductInOrderId { get; set; }

        public DateTime PlacementDate { get; set; }

        public int? Quantity { get; set; }

    }