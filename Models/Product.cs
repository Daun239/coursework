using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Product
{
    public int ProductId { get; set; }

    public int? ProductTypeId { get; set; }

    public int? Price { get; set; }

    public string? Name { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ProductType? ProductType { get; set; }

    public virtual ICollection<ProductsInOrder> ProductsInOrders { get; set; } = new List<ProductsInOrder>();

    public virtual ICollection<ProductsInStorage> ProductsInStorages { get; set; } = new List<ProductsInStorage>();
}
