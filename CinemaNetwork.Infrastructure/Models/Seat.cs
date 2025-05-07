using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class Seat
{
    public int SeatId { get; set; }

    public int? RowNumber { get; set; }

    public int? SeatNumber { get; set; }

    public int HallId { get; set; }

    public int SeatCategoryId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Hall Hall { get; set; } = null!;

    public virtual SeatCategory SeatCategory { get; set; } = null!;

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
