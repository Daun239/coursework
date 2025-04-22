// using Microsoft.AspNetCore.Authentication.JwtBearer;
using CinemaNetwork.Application.Interfaces_Services;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Repositories;
using CinemaNetwork.Services;
using Microsoft.EntityFrameworkCore;
using CinemaNetwork.Application.Services;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using CinemaNetwork.API.MongoDB;
// using CinemaNetwork.API.Identity;

var builder = WebApplication.CreateBuilder(args);


builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection("UserLoggingDatabase"));


var config = builder.Configuration; // Додаємо цю змінну


    

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "CinemaNetwork API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });
});


builder.Services.AddAutoMapper(typeof(MappingProfile));


builder.Services.AddDbContext<CinemaNetworkContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("PC"));
});


builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));



// builder.Services.AddScoped(<UserActionService>);
// Реєстрація репозиторіїв
builder.Services.AddScoped<IAgeRestrictionRepository, AgeRestrictionRepository>();
builder.Services.AddScoped<ICheckRepository, CheckRepository>();
builder.Services.AddScoped<ICheckTicketRepository, CheckTicketRepository>();
builder.Services.AddScoped<ICinemaRepository, CinemaRepository>();
builder.Services.AddScoped<ICityRepository, CityRepository>();
builder.Services.AddScoped<ICountryRepository, CountryRepository>();
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
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





builder.Services.AddScoped<IPasswordHasher<Employee>, PasswordHasher<Employee>>();



// Реєстрація сервісів

// Add this alongside your generic registration
// builder.Services.AddScoped<IService<AgeRestriction, AgeRestrictionDto>, Service<AgeRestriction, AgeRestrictionDto>>();
// builder.Services.AddScoped<ICheckService, CheckService>();
// builder.Services.AddScoped<ICheckTicketService, CheckTicketService>();
// builder.Services.AddScoped<ICinemaService, CinemaService>();
// builder.Services.AddScoped<ICityService, CityService>();
// builder.Services.AddScoped<ICountryService, CountryService>();

// builder.Services.AddScoped<IGenreService, GenreService>();
// builder.Services.AddScoped<IHallService, HallService>();
// builder.Services.AddScoped<IHallTechnologyService, HallTechnologyService>();
// builder.Services.AddScoped<ILanguageService, LanguageService>();
// builder.Services.AddScoped<IMovieGenreService, MovieGenreService>();
// builder.Services.AddScoped<IMovieService, MovieService>();
// builder.Services.AddScoped<IPaymentMethodService, PaymentMethodService>();
// builder.Services.AddScoped<IPublisherService, PublisherService>();
// builder.Services.AddScoped<IRunService, RunService>();
// builder.Services.AddScoped<IScreeningFormatService, ScreeningFormatService>();
// builder.Services.AddScoped<IScreeningService, ScreeningService>();
// builder.Services.AddScoped<ISeatService, SeatService>();
// builder.Services.AddScoped<ITicketService, TicketService>();

builder.Services.AddScoped(typeof(IService<,>), typeof(Service<,>));
builder.Services.AddScoped<IEmployeeService, EmployeeService>();



// builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//     .AddEntityFrameworkStores<CinemaNetworkContext>()
//     .AddDefaultTokenProviders();



//----------------------------------------------jwt------------------


builder.Services.AddAuthentication(x => {
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer( x => {
    x.TokenValidationParameters = new TokenValidationParameters {
        ValidIssuer = config["JWTSettings:Issuer"],
        ValidAudience = config["JWTSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey (Encoding.UTF8.GetBytes(config["JWTSettings:Key"]!)),

        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
    };
});

builder.Services.AddAuthorization();


//-------------------------------------------------------------------









builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Дозволити Angular-застосунок
              .AllowAnyMethod()                     // Дозволити всі методи (GET, POST тощо)
              .AllowAnyHeader()                     // Дозволити всі заголовки
              .AllowCredentials();                  // Дозволити куки, якщо потрібно
    });
});


var app = builder.Build();


// using (var scope = app.Services.CreateScope())
// {
//     var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
//     await RoleSeeder.SeedRolesAsync(roleManager);
// }








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




// builder.Services.AddScoped<IService<ProductsInOrder, ProductsInOrderDto>, Service<ProductsInOrder, ProductsInOrderDto>>();