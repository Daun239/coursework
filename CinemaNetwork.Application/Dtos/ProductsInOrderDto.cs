namespace CinemaNetwork.Application.Dtos;
public partial class ProductsInOrderDto
{
    public int ProductInOrderId { get; set; }

    public int? ProductId { get; set; }

    public int DeliveryOrderId { get; set; }

    public int? Quantity { get; set; }

    public int? Price { get; set; }

}