using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Client
{
    public int ClientId { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public string? CellNumber { get; set; }

    public string? Email { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Check> Checks { get; set; } = new List<Check>();

    public virtual ICollection<ProductCheck> ProductChecks { get; set; } = new List<ProductCheck>();
}
