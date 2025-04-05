using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Employee : IdentityUser // IdentityUser already has Id, Email, PhoneNumber, etc.
{
    public int CinemaId { get; set; }

    public int EmployeePositionId { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Check> Checks { get; set; } = new List<Check>();

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual ICollection<DeliveryOrder> DeliveryOrders { get; set; } = new List<DeliveryOrder>();

    public virtual EmployeePosition EmployeePosition { get; set; } = null!;

    public virtual ICollection<ProductCheck> ProductChecks { get; set; } = new List<ProductCheck>();

    public virtual ICollection<ProductPlacement> ProductPlacements { get; set; } = new List<ProductPlacement>();
}
