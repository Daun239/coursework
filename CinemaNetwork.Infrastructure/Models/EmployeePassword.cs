using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class EmployeePassword
{
    public int EmployeePasswordId { get; set; }

    public string Password { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
