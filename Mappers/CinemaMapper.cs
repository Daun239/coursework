using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Cinema;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class CinemaMapper
    {
        // Map Cinema to CinemaDto
        public static CinemaDto ToDtoFromCinema(this Cinema cinema)
        {
            return new CinemaDto
            {
                CinemasId = cinema.CinemasId,
                Name = cinema.Name,
                CityId = cinema.CityId,
                Address = cinema.Address,
                City = cinema.City
            };
        }

        // Map UpdateCinemaDto to an existing Cinema entity
        public static Cinema ToCinemaFromUpdateDto(this UpdateCinemaDto updateDto)
        {
            return new Cinema
            {
                Name = updateDto.Name,
                CityId = updateDto.CityId,
                Address = updateDto.Address,
                UpdateDateTime = DateTime.Now,
            };

        }
        public static Cinema ToCinemaFromDto(this CinemaDto dto)
        {
            return new Cinema
            {
                CinemasId = dto.CinemasId,
                Name = dto.Name,
                CityId = dto.CityId,
                Address = dto.Address,
            };
        }
    }
}