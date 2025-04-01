namespace CinemaNetwork.Application.Dtos;

    public partial class TicketDto
    {
        public int TicketId { get; set; }

        public int SeatId { get; set; }

        public int ScreeningId { get; set; }

        public int? Price { get; set; }

        public int? Number { get; set; }
    }