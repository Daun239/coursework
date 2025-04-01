using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class ProductsInOrder
{
    public int ProductInOrderId { get; set; }

    public int? ProductId { get; set; }

    public int DeliveryOrderId { get; set; }

    public int? Quantity { get; set; }

    public int? Price { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual DeliveryOrder DeliveryOrder { get; set; } = null!;

    public virtual Product? Product { get; set; }

    public virtual ICollection<ProductPlacement> ProductPlacements { get; set; } = new List<ProductPlacement>();
}
