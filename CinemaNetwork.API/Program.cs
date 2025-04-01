// using Microsoft.AspNetCore.Authentication.JwtBearer;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Repositories;
using CinemaNetwork.Services;
using Microsoft.EntityFrameworkCore;
using CinemaNetwork.Application.Services;
using CinemaNetwork.API.Models;
using CinemaNetwork.Application.Dtos;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(MappingProfile));


builder.Services.AddDbContext<CinemaNetwork.Infrastructure.Data.CinemaNetworkContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Laptop"));
});


// Реєстрація репозиторіїв
builder.Services.AddScoped<IAgeRestrictionRepository, AgeRestrictionRepository>();
builder.Services.AddScoped<ICheckRepository, CheckRepository>();
builder.Services.AddScoped<ICheckTicketRepository, CheckTicketRepository>();
builder.Services.AddScoped<ICinemaRepository, CinemaRepository>();
builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<ICountryRepository, CountryRepository>();
// builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<IHallRepository, HallRepository>();
builder.Services.AddScoped<IHallTechnologyRepository, HallTechnologyRepository>();
builder.Services.AddScoped<ILanguageRepository, LanguageRepository>();
// builder.Services.AddScoped<IMovieGenreRepository, MovieGenreRepository>();
builder.Services.AddScoped<IMovieRepository, MovieRepository>();
builder.Services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
builder.Services.AddScoped<IPublisherRepository, PublisherRepository>();
builder.Services.AddScoped<IRunRepository, RunRepository>();
builder.Services.AddScoped<IScreeningFormatRepository, ScreeningFormatRepository>();
builder.Services.AddScoped<IScreeningRepository, ScreeningRepository>();
builder.Services.AddScoped<ISeatRepository, SeatRepository>();
builder.Services.AddScoped<ITicketRepository, TicketRepository>();

// Реєстрація сервісів
builder.Services.AddScoped<IAgeRestrictionService, AgeRestrictionService>();
builder.Services.AddScoped<ICheckService, CheckService>();
builder.Services.AddScoped<ICheckTicketService, CheckTicketService>();
builder.Services.AddScoped<ICinemaService, CinemaService>();
builder.Services.AddScoped<ICityService, CityService>();
builder.Services.AddScoped<ICountryService, CountryService>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IHallService, HallService>();
builder.Services.AddScoped<IHallTechnologyService, HallTechnologyService>();
builder.Services.AddScoped<ILanguageService, LanguageService>();
builder.Services.AddScoped<IMovieGenreService, MovieGenreService>();
builder.Services.AddScoped<IMovieService, MovieService>();
builder.Services.AddScoped<IPaymentMethodService, PaymentMethodService>();
builder.Services.AddScoped<IPublisherService, PublisherService>();
builder.Services.AddScoped<IRunService, RunService>();
builder.Services.AddScoped<IScreeningFormatService, ScreeningFormatService>();
builder.Services.AddScoped<IScreeningService, ScreeningService>();
builder.Services.AddScoped<ISeatService, SeatService>();
builder.Services.AddScoped<ITicketService, TicketService>();

builder.Services.AddScoped(typeof(IService<,>), typeof(Service<,>));
builder.Services.AddScoped<IService<ProductsInOrder, ProductsInOrderDto>, Service<ProductsInOrder, ProductsInOrderDto>>();




builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Дозволити Angular-застосунок
              .AllowAnyMethod()                     // Дозволити всі методи (GET, POST тощо)
              .AllowAnyHeader()                     // Дозволити всі заголовки
              .AllowCredentials();                  // Дозволити куки, якщо потрібно
    });
});


var app = builder.Build();


app.UseCors("AllowSpecificOrigins");


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();



