using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class SeatCategory
{
    public int SeatCategoryId { get; set; }

    public string SeatCategory1 { get; set; } = null!;

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<ScreeningPrice> ScreeningPrices { get; set; } = new List<ScreeningPrice>();

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
}
