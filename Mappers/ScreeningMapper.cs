using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Screening;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class ScreeningMapper
    {
        public static ScreeningDto FromScreeningToDto(this Screening screening)
        {
            return new ScreeningDto
            {
                ScreeningsId = screening.ScreeningsId,
                ScreeningFormatsId = screening.ScreeningFormatsId,
                HallsId = screening.HallsId,
                RunsId = screening.RunsId,
                LanguagesId = screening.LanguagesId,
                StartDate = screening.StartDate,
                StartTime = screening.StartTime,
                EndTime = screening.EndTime,

                ScreeningFormats = screening.ScreeningFormats,
                Halls = screening.Halls,
                Runs = screening.Runs,
                Languages = screening.Languages,
            };
        }

public static Screening toScreeningFromUpdateDto(this UpdateScreeningDto dto)
        {
            return new Screening
            {
                ScreeningFormatsId = dto.ScreeningFormatsId,
                HallsId = dto.HallsId,
                RunsId = dto.RunsId,
                LanguagesId = dto.LanguagesId,
                StartDate = dto.StartDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
            };
        }
    }
}