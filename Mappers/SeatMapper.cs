using CinemaNetwork.Application.Dtos.Seat;
using CinemaNetwork.Application.Mappers.api.Mappers;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class SeatMapper
    {
        // Маппінг сутності Seat в SeatDto
        public static SeatDto FromSeatToDto(this Seat seat)
        {
            return new SeatDto
            {
                RowNumber = seat.RowNumber,
                SeatNumber = seat.SeatNumber,
                HallId = seat.HallId,
                IsVipCategory = seat.IsVipCategory,
                Halls = seat.Halls.ToHallDto(),
            };
        }

        // Маппінг DTO SeatDto у сутність Seat
        public static Seat FromDtoToSeat(this SeatDto seatDto)
        {
            return new Seat
            {
                RowNumber = seatDto.RowNumber,
                SeatNumber = seatDto.SeatNumber,
                HallId = seatDto.HallId,
                IsVipCategory = seatDto.IsVipCategory,
                Halls = seatDto.Halls?.ToHallFromDto(),
            };
        }

        // Маппінг UpdateSeatDto в сутність Seat (для оновлення)
        public static Seat toSeatFromUpdateDto(this UpdateSeatDto updateSeatDto)
        {
            return new Seat
            {
                RowNumber = updateSeatDto.RowNumber,
                SeatNumber = updateSeatDto.SeatNumber,
                HallId = updateSeatDto.HallId,
                IsVipCategory = updateSeatDto.IsVipCategory,
            };

        }
    }
}
