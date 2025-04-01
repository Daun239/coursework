using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class DeliveryOrder
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

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual DeliveryOrderStatus? DeliveryOrderStatus { get; set; }

    public virtual Employee? Employee { get; set; }

    public virtual PaymentMethod? PaymentMethod { get; set; }

    public virtual ICollection<ProductsInOrder> ProductsInOrders { get; set; } = new List<ProductsInOrder>();

    public virtual Supplier? Supplier { get; set; }
}
