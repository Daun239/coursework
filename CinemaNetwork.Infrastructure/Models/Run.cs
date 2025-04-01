using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Run
{
    public int RunId { get; set; }

    public int MovieId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Movie Movie { get; set; } = null!;

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
}
