using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class City
{
    public int CityId { get; set; }

    public string? City1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Cinema> Cinemas { get; set; } = new List<Cinema>();
}
