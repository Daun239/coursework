using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Data
{
    public interface IDbContext
    {
        public DbSet<Publisher> Publishers { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<AgeRestriction> AgeRestrictions { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<HallTechnology> HallTechnologies { get; set; }
        public DbSet<ScreeningFormat> ScreeningFormats { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Cinema> Cinemas { get; set; }
        public DbSet<Hall> Halls { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Run> Runs { get; set; }
        public DbSet<Screening> Screenings { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Check> Checks { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<CheckTicket> CheckTickets { get; set; }
        public DbSet<MoviesGenre> MoviesGenres { get; set; }
    }
}