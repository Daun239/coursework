using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Run;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class RunMapper
    {
        // Map Run entity to RunDto
        public static RunDto ToRunDto(this Run run)
        {
            return new RunDto
            {
                RunsId = run.RunsId,
                StartDate = run.StartDate,
                EndDate = run.EndDate,
                MovieId = run.MovieId,
                Movie = run.Movie?.FromMovieToDto(),
            };
        }

        // Map UpdateRunDto to an existing Run entity
        public static Run toRunFromUpdateDto(this UpdateRunDto updateRunDto)
        {
            return new Run
            {
                StartDate = updateRunDto.StartDate,
                EndDate = updateRunDto.EndDate,
                MovieId = updateRunDto.MovieId,
            };
        }

        // Map RunDto to Run entity (useful for creating a new Run)
        public static Run ToRunFromDto(this RunDto runDto)
        {
            return new Run
            {
                RunsId = runDto.RunsId,
                StartDate = runDto.StartDate,
                EndDate = runDto.EndDate,
                MovieId = runDto.MovieId,
                Movie = runDto.Movie?.ToMovieFromDto(),
            };
        }
    }
}