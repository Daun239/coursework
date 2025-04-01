using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class AgeRestriction
{
    public int AgeRestrictionId { get; set; }

    public int? AgeRestriction1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();
}
