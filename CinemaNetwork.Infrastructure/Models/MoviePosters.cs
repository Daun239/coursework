using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CinemaNetwork.Infrastructure.Models
{
    public class MoviePoster
    {
        [Key]
        public int MoviePosterId { get; set; }

        public string? PosterFileName { get; set; }

        [NotMapped] // Exclude this from the database; it's used for API input
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ImageData { get; set; }

        [Required]
        [JsonIgnore] // Exclude binary data from API output
        public byte[]? BinaryImageData { get; set; }

        [ForeignKey("Movie")]
        public int MovieId { get; set; }

        public virtual Movie? Movie { get; set; }
    }
}
