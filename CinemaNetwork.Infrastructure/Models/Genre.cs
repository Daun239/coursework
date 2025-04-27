using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Genre
{
    public int GenreId { get; set; }

    public string? Genre1 { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<MoviesGenre> MoviesGenres { get; set; } = new List<MoviesGenre>();
}
