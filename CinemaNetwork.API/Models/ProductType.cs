using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class ProductType
{
    public int ProductTypeId { get; set; }

    public string? ProductType1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
