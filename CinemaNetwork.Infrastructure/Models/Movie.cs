using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Movie
{
    public int MovieId { get; set; }

    public int? CountryId { get; set; }

    public int? AgeRestrictionId { get; set; }

    public int? PublisherId { get; set; }

    public int? LanguageId { get; set; }

    public int? Budget { get; set; }

    public int? Runtime { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual AgeRestriction? AgeRestriction { get; set; }

    public virtual Country? Country { get; set; }

    public virtual Language? Language { get; set; }

    public virtual ICollection<MoviesGenre> MoviesGenres { get; set; } = new List<MoviesGenre>();

    public virtual Publisher? Publisher { get; set; }

    public virtual ICollection<Run> Runs { get; set; } = new List<Run>();
}
