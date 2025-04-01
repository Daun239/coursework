using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class ProductCheck
{
    public int ProductCheckId { get; set; }

    public int? PaymentMethodId { get; set; }

    public int? ClientId { get; set; }

    public int? EmployeeId { get; set; }

    public int? Number { get; set; }

    public int? Sum { get; set; }

    public DateTime? BuyTime { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Client? Client { get; set; }

    public virtual Employee? Employee { get; set; }

    public virtual PaymentMethod? PaymentMethod { get; set; }

    public virtual ICollection<ProductCheckDetail> ProductCheckDetails { get; set; } = new List<ProductCheckDetail>();
}
