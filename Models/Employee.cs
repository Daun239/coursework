using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Employee
{
    public int EmployeeId { get; set; }  // Your DB's PK

    public int CinemaId { get; set; }

    public int EmployeePositionId { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public string? CellNumber { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash {get; set; } = null!;

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Check> Checks { get; set; } = new List<Check>();

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual ICollection<DeliveryOrder> DeliveryOrders { get; set; } = new List<DeliveryOrder>();

    public virtual EmployeePosition EmployeePosition { get; set; } = null!;

    public virtual ICollection<ProductCheck> ProductChecks { get; set; } = new List<ProductCheck>();

    public virtual ICollection<ProductPlacement> ProductPlacements { get; set; } = new List<ProductPlacement>();
}
