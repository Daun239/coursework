using System;
using System.Collections.Generic;

namespace CinemaNetwork.Infrastructure.Models;

public partial class ScreeningPrice
{
    public int ScreeningPricingId { get; set; }

    public int? TicketPrice { get; set; }

    public int? VipTicketPrice { get; set; }

    public int? ScreeningId { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual Screening? Screening { get; set; }
}
