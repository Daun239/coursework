namespace CinemaNetwork.Application.Dtos;
    public partial class ScreeningDto
    {
        public int ScreeningId { get; set; }

        public int? ScreeningFormatId { get; set; }

        public int HallId { get; set; }

        public int RunId { get; set; }

        public int? LanguageId { get; set; }

        public DateOnly StartDate { get; set; }

        public TimeOnly StartTime { get; set; }

        public TimeOnly EndTime { get; set; }
    }