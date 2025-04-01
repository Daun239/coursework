namespace CinemaNetwork.Application.Dtos;
    public partial class RunDto
    {
        public int RunId { get; set; }

        public int MovieId { get; set; }

        public DateOnly StartDate { get; set; }

        public DateOnly EndDate { get; set; }
    }