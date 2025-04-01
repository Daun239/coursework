namespace CinemaNetwork.Application.Dtos;
    public partial class ProductCheckDto
    {
        public int ProductCheckId { get; set; }

        public int? PaymentMethodId { get; set; }

        public int? ClientId { get; set; }

        public int? EmployeeId { get; set; }

        public int? Number { get; set; }

        public int? Sum { get; set; }

        public DateTime? BuyTime { get; set; }

    }