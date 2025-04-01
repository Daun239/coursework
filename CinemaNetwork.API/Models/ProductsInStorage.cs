using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class ProductsInStorage
{
    public int ProductInStorageId { get; set; }

    public int ProductId { get; set; }

    public int CinemaId { get; set; }

    public DateTime? ProductionDate { get; set; }

    public DateTime? ExpirationDate { get; set; }

    public int? Quantity { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;

    public virtual ICollection<ProductCheckDetail> ProductCheckDetails { get; set; } = new List<ProductCheckDetail>();

    public virtual ICollection<ProductPlacement> ProductPlacements { get; set; } = new List<ProductPlacement>();
}
