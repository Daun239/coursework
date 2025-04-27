using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class HallTechnology
{
    public int HallTechnologyId { get; set; }

    public string? HallTechnology1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Hall> Halls { get; set; } = new List<Hall>();
}
