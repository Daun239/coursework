using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Infrastructure.Interfaces
{
     public interface IAgeRestrictionRepository : IRepository<AgeRestriction>
    {
        // If needed, you can add specific methods for AgeRestriction
    }
}