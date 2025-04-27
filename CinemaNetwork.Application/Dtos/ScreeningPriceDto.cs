namespace CinemaNetwork.Application.Dtos;

public partial class ScreeningPriceDto
{
    public int ScreeningPricingId { get; set; }

    public int? TicketPrice { get; set; }

    public int? VipTicketPrice { get; set; }

    public int? ScreeningId { get; set; }

}
