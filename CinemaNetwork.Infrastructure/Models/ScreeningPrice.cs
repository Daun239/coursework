using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class ScreeningPrice
{
    public int ScreeningPriceId { get; set; }

    public int? TicketPrice { get; set; }

    public int ScreeningId { get; set; }

    public int SeatCategoryId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Screening Screening { get; set; } = null!;

    public virtual SeatCategory SeatCategory { get; set; } = null!;

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
