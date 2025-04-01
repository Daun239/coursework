namespace CinemaNetwork.Application.Dtos;
public class DeliveryOrderDto
{
    public int DeliveryOrderId { get; set; }

    public int? DeliveryOrderStatusId { get; set; }

    public int? PaymentMethodId { get; set; }

    public int? SupplierId { get; set; }

    public int? EmployeeId { get; set; }

    public int? Number { get; set; }

    public int? Sum { get; set; }

    public DateTime OrderDateTime { get; set; }

    public DateTime? EndDateTime { get; set; }
}