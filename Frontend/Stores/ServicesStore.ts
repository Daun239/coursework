import { create } from "zustand";

// Import all services from the Lib folder
import { AgeRestrictionService } from "../Lib/AgeRestrictionService";
import { CheckService } from "../Lib/Check";
import { CheckTicketService } from "../Lib/CheckTicket";
import { CinemaService } from "../Lib/Cinema";
import { ClientService } from "../Lib/Client";
import { CityService } from "../Lib/City";
import { CountryService } from "../Lib/Country";
import { DeliveryOrderService } from "../Lib/DeliveryOrder";
import { DeliveryOrderStatusService } from "../Lib/DeliveryOrderStatus";
import { EmployeeService } from "../Lib/Employee";
import { EmployeePositionService } from "../Lib/EmployeePosition";
import { GenericService } from "../Lib/GenericService";
import { GenreService } from "../Lib/Genre";
import { HallService } from "../Lib/Hall";
import { HallTechnologyService } from "../Lib/HallTechnology";
import { LanguageService } from "../Lib/Language";
import { MovieService } from "../Lib/Movie";
// import { MoviePosterService } from "../Lib/MoviePoster";
import { MoviesGenreService } from "../Lib/MoviesGenre";
import { PaymentMethodService } from "../Lib/PaymentMethod";
import { ProductService } from "../Lib/Product";
import { ProductCheckService } from "../Lib/ProductCheck";
import { ProductCheckDetailService } from "../Lib/ProductCheckDetail";
import { ProductPlacementService } from "../Lib/ProductPlacement";
import { ProductsInOrderService } from "../Lib/ProductsInOrder";
import { ProductsInStorageService } from "../Lib/ProductsInStorage";
import { ProductTypeService } from "../Lib/ProductType";
import { PublisherService } from "../Lib/Publisher";
import { RunService } from "../Lib/Run";
import { ScreeningService } from "../Lib/Screening";
import { ScreeningFormatService } from "../Lib/ScreeningFormat";
import { SeatService } from "../Lib/Seat";
import { SupplierService } from "../Lib/Supplier";
import { TicketService } from "../Lib/Ticket";
import { LoginService } from "../Lib/LoginService";

// You can create a base URL here and reuse it if needed
const baseUrl = import.meta.env.VITE_API_URL;

type ServiceStore = {
  ageRestrictionService: AgeRestrictionService;
  checkService: CheckService;
  checkTicketService: CheckTicketService;
  cinemaService: CinemaService;
  clientService: ClientService;
  cityService: CityService;
  countryService: CountryService;
  deliveryOrderService: DeliveryOrderService;
  deliveryOrderStatusService: DeliveryOrderStatusService;
  employeeService: EmployeeService;
  employeePositionService: EmployeePositionService;
//   genericService: GenericService;
  genreService: GenreService;
  hallService: HallService;
  hallTechnologyService: HallTechnologyService;
  languageService: LanguageService;
  movieService: MovieService;
//   moviePosterService: MoviePosterService;
  moviesGenreService: MoviesGenreService;
  paymentMethodService: PaymentMethodService;
  productService: ProductService;
  productCheckService: ProductCheckService;
  productCheckDetailService: ProductCheckDetailService;
  productPlacementService: ProductPlacementService;
  productsInOrderService: ProductsInOrderService;
  productsInStorageService: ProductsInStorageService;
  productTypeService: ProductTypeService;
  publisherService: PublisherService;
  runService: RunService;
  screeningService: ScreeningService;
  screeningFormatService: ScreeningFormatService;
  seatService: SeatService;
  supplierService: SupplierService;
  ticketService: TicketService;
  loginService : LoginService;
};

export const useServiceStore = create<ServiceStore>(() => ({ 
    ageRestrictionService: new AgeRestrictionService(`${baseUrl}/ageRestriction`), 
    checkService: new CheckService(`${baseUrl}/check`), 
    checkTicketService: new CheckTicketService(`${baseUrl}/checkTicket`), 
    cinemaService: new CinemaService(`${baseUrl}/cinema`), 
    clientService: new ClientService(`${baseUrl}/client`), 
    cityService: new CityService(`${baseUrl}/city`), 
    countryService: new CountryService(`${baseUrl}/country`), 
    deliveryOrderService: new DeliveryOrderService(`${baseUrl}/deliveryOrder`), 
    deliveryOrderStatusService: new DeliveryOrderStatusService(`${baseUrl}/deliveryOrderStatus`), 
    employeeService: new EmployeeService(`${baseUrl}/employee`), 
    employeePositionService: new EmployeePositionService(`${baseUrl}/employeePosition`), 
    genericService: new GenericService(`${baseUrl}/generic`), 
    genreService: new GenreService(`${baseUrl}/genre`), 
    hallService: new HallService(`${baseUrl}/hall`), 
    hallTechnologyService: new HallTechnologyService(`${baseUrl}/hallTechnology`), 
    languageService: new LanguageService(`${baseUrl}/language`), 
    movieService: new MovieService(`${baseUrl}/movie`), 
    // moviePosterService: new MoviePosterService(`${baseUrl}/moviePoster`), 
    moviesGenreService: new MoviesGenreService(`${baseUrl}/movieGenre`), 
    paymentMethodService: new PaymentMethodService(`${baseUrl}/paymentMethod`), 
    productService: new ProductService(`${baseUrl}/product`), 
    productCheckService: new ProductCheckService(`${baseUrl}/productCheck`), 
    productCheckDetailService: new ProductCheckDetailService(`${baseUrl}/productCheckDetail`), 
    productPlacementService: new ProductPlacementService(`${baseUrl}/productPlacement`), 
    productsInOrderService: new ProductsInOrderService(`${baseUrl}/productInOrder`), 
    productsInStorageService: new ProductsInStorageService(`${baseUrl}/productInStorage`), 
    productTypeService: new ProductTypeService(`${baseUrl}/productType`), 
    publisherService: new PublisherService(`${baseUrl}/publisher`), 
    runService: new RunService(`${baseUrl}/run`), 
    screeningService: new ScreeningService(`${baseUrl}/screening`), 
    screeningFormatService: new ScreeningFormatService(`${baseUrl}/screeningFormat`), 
    seatService: new SeatService(`${baseUrl}/seat`), 
    supplierService: new SupplierService(`${baseUrl}/supplier`), 
    ticketService: new TicketService(`${baseUrl}/ticket`), 
    loginService: new LoginService(`${baseUrl}/login`)
  }));
