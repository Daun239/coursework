using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class DeliveryOrderStatus
{
    public int DeliveryOrderStatusId { get; set; }

    public string? DeliveryOrderStatus1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<DeliveryOrder> DeliveryOrders { get; set; } = new List<DeliveryOrder>();
}
