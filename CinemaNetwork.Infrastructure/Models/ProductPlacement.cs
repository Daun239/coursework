using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class ProductPlacement
{
    public int ProductPlacementId { get; set; }

    public int EmployeeId { get; set; }

    public int ProductInStorageId { get; set; }

    public int ProductInOrderId { get; set; }

    public DateTime PlacementDate { get; set; }

    public int? Quantity { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Employee Employee { get; set; } = null!;

    public virtual ProductsInOrder ProductInOrder { get; set; } = null!;

    public virtual ProductsInStorage ProductInStorage { get; set; } = null!;
}
