using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class MoviesGenre
{
    public int MoviesGenresId { get; set; }

    public int MovieId { get; set; }

    public int GenreId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Genre Genre { get; set; } = null!;

    public virtual Movie Movie { get; set; } = null!;
}
