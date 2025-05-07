namespace CinemaNetwork.Application.Dtos;

public partial class TicketDto
{
    public int TicketId { get; set; }

    public int SeatId { get; set; }

    public int ScreeningPriceId { get; set; }

    public int? Number { get; set; }
}