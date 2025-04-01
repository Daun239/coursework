using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Hall;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{

    namespace api.Mappers
    {
        public static class HallMapper
        {
            // Map Hall to HallDto
            public static HallDto ToHallDto(this Hall hall)
            {
                return new HallDto
                {
                    HallsId = hall.HallsId,
                    CinemaId = hall.CinemaId,
                    HallNumber = hall.HallNumber,
                    HallTechnologiesId = hall.HallTechnologiesId,
                    Cinema = hall.Cinema?.ToDtoFromCinema(), // Assuming Cinema has its own mapping
                    HallTechnology = hall.HallTechnology // Direct mapping or implement a mapping if needed
                };
            }

            // Map UpdateHallDto to Hall
            public static Hall ToHallFromUpdateDto(this UpdateHallDto updateDto)
            {
                return new Hall
                {
                    CinemaId = updateDto.CinemaId,
                    HallNumber = updateDto.HallNumber,
                    HallTechnologiesId = updateDto.HallTechnologiesId,
                    UpdateDateTime = DateTime.Now,
                };

            }

            // Map HallDto to Hall (for example, creating a new Hall)
            public static Hall ToHallFromDto(this HallDto dto)
            {
                return new Hall
                {
                    HallsId = dto.HallsId,
                    CinemaId = dto.CinemaId,
                    HallNumber = dto.HallNumber,
                    HallTechnologiesId = dto.HallTechnologiesId,
                    CreateDateTime = DateTime.Now
                };
            }
        }
    }

}