using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class ScreeningFormat
{
    public int ScreeningFormatId { get; set; }

    public string? ScreeningFormat1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
}
