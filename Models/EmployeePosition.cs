using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class EmployeePosition
{
    public int EmployeePositionId { get; set; }

    public string? EmployeePosition1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
