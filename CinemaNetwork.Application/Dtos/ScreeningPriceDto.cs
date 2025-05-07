namespace CinemaNetwork.Application.Dtos;

public partial class ScreeningPriceDto
{
    public int ScreeningPriceId { get; set; }

    public int? TicketPrice { get; set; }

    public int ScreeningId { get; set; }

    public int SeatCategoryId { get; set; }

}
