using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class ProductCheckDetail
{
    public int ProductCheckDetailId { get; set; }

    public int ProductCheckId { get; set; }

    public int ProductInStorageId { get; set; }

    public int? Quantity { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ProductCheck ProductCheck { get; set; } = null!;

    public virtual ProductsInStorage ProductInStorage { get; set; } = null!;
}
