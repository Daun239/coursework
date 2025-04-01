using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Language
{
    public int LanguageId { get; set; }

    public string? Language1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<Movie> Movies { get; set; } = new List<Movie>();

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();
}
