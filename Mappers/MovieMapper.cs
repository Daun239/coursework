using CinemaNetwork.Application.Dtos.Movie;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace CinemaNetwork.Application.Mappers
{
    public static class MovieMapper
    {
        // Map Movie to MovieDto
        public static MovieDto FromMovieToDto(this Movie movie)
        {
            return new MovieDto
            {
                MoviesId = movie.MoviesId,
                Name = movie.Name,
                CountriesId = movie.CountriesId,
                AgeRestrictionsId = movie.AgeRestrictionsId,
                PublishersId = movie.PublishersId,
                Runtime = movie.Runtime,
                Description = movie.Description,
                Budget = movie.Budget,
                LanguagesId = movie.LanguagesId,
                Publisher = movie.Publisher,
                Language = movie.Language,
                Country = movie.Country,
                AgeRestriction = movie.AgeRestriction,
                PosterBase64 = movie.Poster != null ? Convert.ToBase64String(movie.Poster) : null,
            };
        }

        // Convert MovieDto to Movie (for Create/Update operations)
        public static Movie ToMovieFromDto(this MovieDto movieDto)
        {
            return new Movie
            {
                MoviesId = movieDto.MoviesId,
                Name = movieDto.Name,
                CountriesId = movieDto.CountriesId,
                AgeRestrictionsId = movieDto.AgeRestrictionsId,
                PublishersId = movieDto.PublishersId,
                Runtime = movieDto.Runtime,
                Description = movieDto.Description,
                Budget = movieDto.Budget,
                LanguagesId = movieDto.LanguagesId,
                Publisher = movieDto.Publisher,
                Language = movieDto.Language,
                Country = movieDto.Country,
                AgeRestriction = movieDto.AgeRestriction,
                // Convert Poster from base64 string (if needed)
                Poster = movieDto.PosterBase64 != null ? Convert.FromBase64String(movieDto.PosterBase64) : null,
            };
        }

        // Convert UpdateMovieDto (with IFormFile) to Movie (for Create/Update operations)
        public static Movie ToMovieFromUpdateDto(this UpdateMovieDto updateMovieDto)
        {
            var movie = new Movie
            {
                Name = updateMovieDto.Name,
                CountriesId = updateMovieDto.CountriesId,
                AgeRestrictionsId = updateMovieDto.AgeRestrictionsId,
                PublishersId = updateMovieDto.PublishersId,
                Runtime = updateMovieDto.Runtime,
                Description = updateMovieDto.Description,
                Budget = updateMovieDto.Budget,
                LanguagesId = updateMovieDto.LanguagesId,
                UpdateDateTime = DateTime.Now,
            };

            // If a poster file is uploaded, convert it to byte[] and store it
            if (updateMovieDto.PosterFile != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    updateMovieDto.PosterFile.CopyTo(memoryStream);
                    movie.Poster = memoryStream.ToArray(); // Store as byte[]
                }
            }

            return movie;
        }
    }
}
