using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Publisher
{
    public int PublisherId { get; set; }

    public string? Publisher1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
