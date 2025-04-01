using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Ticket
{
    public int TicketId { get; set; }

    public int SeatId { get; set; }

    public int ScreeningId { get; set; }

    public int? Price { get; set; }

    public int? Number { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual CheckTicket? CheckTicket { get; set; }

    public virtual Screening Screening { get; set; } = null!;

    public virtual Seat Seat { get; set; } = null!;
}
