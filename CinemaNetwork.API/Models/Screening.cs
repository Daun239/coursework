using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Screening
{
    public int ScreeningId { get; set; }

    public int? ScreeningFormatId { get; set; }

    public int HallId { get; set; }

    public int RunId { get; set; }

    public int? LanguageId { get; set; }

    public DateOnly StartDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Hall Hall { get; set; } = null!;

    public virtual Language? Language { get; set; }

    public virtual Run Run { get; set; } = null!;

    public virtual ScreeningFormat? ScreeningFormat { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
