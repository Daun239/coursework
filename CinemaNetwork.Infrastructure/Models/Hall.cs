using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Hall
{
    public int HallId { get; set; }

    public int CinemaId { get; set; }

    public int? HallNumber { get; set; }

    public int? HallTechnologyId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Cinema Cinema { get; set; } = null!;

    public virtual HallTechnology? HallTechnology { get; set; }

    public virtual ICollection<Screening> Screenings { get; set; } = new List<Screening>();

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
