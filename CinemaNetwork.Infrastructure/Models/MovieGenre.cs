using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CinemaNetwork.Infrastructure.Models
{
    public class MovieGenre
    {
        [Key]
        public int MoviesGenresId { get; set; }

        [ForeignKey("Movies")]
        public int MoviesId { get; set; }

        [ForeignKey("Genres")]
        public int GenresId { get; set; }

        // Navigation properties
        public virtual Movie? Movies { get; set; }
        public virtual Genre? Genres { get; set; }
    }
}
