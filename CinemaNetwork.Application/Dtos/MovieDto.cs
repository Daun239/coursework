namespace CinemaNetwork.Application.Dtos;



    public partial class MovieDto
    {
        public int MovieId { get; set; }

        public int? CountryId { get; set; }

        public int? AgeRestrictionId { get; set; }

        public int? PublisherId { get; set; }

        public int? LanguageId { get; set; }

        public int? Budget { get; set; }

        public int? Runtime { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }
    }