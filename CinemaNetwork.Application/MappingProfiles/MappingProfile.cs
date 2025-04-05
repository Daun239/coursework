using AutoMapper;
using CinemaNetwork.Application.Dtos;
using CinemaNetwork.Infrastructure.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<AgeRestriction, AgeRestrictionDto>().ReverseMap();
        CreateMap<Check, CheckDto>().ReverseMap();
        CreateMap<CheckTicket, CheckTicketDto>().ReverseMap();
        CreateMap<Cinema, CinemaDto>().ReverseMap();
        CreateMap<City, CityDto>().ReverseMap();
        CreateMap<Client, ClientDto>().ReverseMap();
        CreateMap<Country, CountryDto>().ReverseMap();
        CreateMap<DeliveryOrder, DeliveryOrderDto>().ReverseMap();
        CreateMap<DeliveryOrderStatus, DeliveryOrderStatusDto>().ReverseMap();
        CreateMap<Employee, EmployeeDto>().ReverseMap();
        CreateMap<EmployeePosition, EmployeePositionDto>().ReverseMap();
        CreateMap<Genre, GenreDto>().ReverseMap();
        CreateMap<Hall, HallDto>().ReverseMap();
        CreateMap<HallTechnology, HallTechnologyDto>().ReverseMap();
        CreateMap<Language, LanguageDto>().ReverseMap();
        CreateMap<Movie, MovieDto>().ReverseMap();
        // CreateMap<MoviePoster, MoviePosterDto>().ReverseMap();
        CreateMap<MoviesGenre, MoviesGenreDto>().ReverseMap();
        CreateMap<PaymentMethod, PaymentMethodDto>().ReverseMap();
        CreateMap<ProductCheckDetail, ProductCheckDetailDto>().ReverseMap();
        CreateMap<ProductCheck, ProductCheckDto>().ReverseMap();
        CreateMap<Product, ProductDto>().ReverseMap();
        CreateMap<ProductPlacement, ProductPlacementDto>().ReverseMap();
        CreateMap<ProductsInOrder, ProductsInOrderDto>().ReverseMap();
        CreateMap<ProductsInStorage, ProductsInStorageDto>().ReverseMap();
        CreateMap<ProductType, ProductTypeDto>().ReverseMap();
        CreateMap<Publisher, PublisherDto>().ReverseMap();
        CreateMap<Run, RunDto>().ReverseMap();
        CreateMap<Screening, ScreeningDto>().ReverseMap();
        CreateMap<ScreeningFormat, ScreeningFormatDto>().ReverseMap();
        CreateMap<Seat, SeatDto>().ReverseMap();
        CreateMap<Supplier, SupplierDto>().ReverseMap();
        CreateMap<Ticket, TicketDto>().ReverseMap();
    }
}
