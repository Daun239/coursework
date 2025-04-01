using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class CheckTicket
{
    public int CheckTicketId { get; set; }

    public int CheckId { get; set; }

    public int TicketId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Check Check { get; set; } = null!;

    public virtual Ticket Ticket { get; set; } = null!;
}
