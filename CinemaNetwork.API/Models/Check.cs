using System;
using System.Collections.Generic;

namespace CinemaNetwork.API.Models;

public partial class Check
{
    public int CheckId { get; set; }

    public int? Sum { get; set; }

    public int? PaymentMethodId { get; set; }

    public int EmployeeId { get; set; }

    public int ClientId { get; set; }

    public DateTime? BuyDateTime { get; set; }

    public DateTime? CreateDateTime { get; set; }

    public DateTime? UpdateDateTime { get; set; }

    public virtual ICollection<CheckTicket> CheckTickets { get; set; } = new List<CheckTicket>();

    public virtual Client Client { get; set; } = null!;

    public virtual Employee Employee { get; set; } = null!;

    public virtual PaymentMethod? PaymentMethod { get; set; }
}
