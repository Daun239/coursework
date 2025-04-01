namespace CinemaNetwork.Application.Dtos;

    public partial class ProductCheckDetailDto
    {
        public int ProductCheckDetailId { get; set; }

        public int ProductCheckId { get; set; }

        public int ProductInStorageId { get; set; }

        public int? Quantity { get; set; }
    }