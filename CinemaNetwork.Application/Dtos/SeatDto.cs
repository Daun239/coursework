namespace CinemaNetwork.Application.Dtos;
    public partial class SeatDto
    {
        public int SeatId { get; set; }

        public int? RowNumber { get; set; }

        public int? SeatNumber { get; set; }

        public int HallId { get; set; }

        public bool? IsVipCategory { get; set; }
    }