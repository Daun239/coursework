namespace CinemaNetwork.Application.Dtos;
public partial class SeatDto
{
    public int SeatId { get; set; }

    public int? RowNumber { get; set; }

    public int? SeatNumber { get; set; }

    public int HallId { get; set; }

    public int SeatCategoryId { get; set; }
}