using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class PaymentMethod
{
    public int PaymentMethodId { get; set; }

    public string? PaymentMethod1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Check> Checks { get; set; } = new List<Check>();

    public virtual ICollection<DeliveryOrder> DeliveryOrders { get; set; } = new List<DeliveryOrder>();

    public virtual ICollection<ProductCheck> ProductChecks { get; set; } = new List<ProductCheck>();
}
