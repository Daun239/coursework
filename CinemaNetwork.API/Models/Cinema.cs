using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Cinema
{
    public int CinemaId { get; set; }

    public int? CityId { get; set; }

    public string? Name { get; set; }

    public string? Address { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual City? City { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<Hall> Halls { get; set; } = new List<Hall>();

    public virtual ICollection<ProductsInStorage> ProductsInStorages { get; set; } = new List<ProductsInStorage>();
}
