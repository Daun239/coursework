
namespace CinemaNetwork.Application.Dtos;

public partial class CheckDto
{
    public int CheckId { get; set; }

    public int? Sum { get; set; }

    public int? PaymentMethodId { get; set; }

    public int EmployeeId { get; set; }

    public int ClientId { get; set; }

    public DateTime? BuyDateTime { get; set; }
}
