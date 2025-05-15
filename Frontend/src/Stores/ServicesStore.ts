import { create } from "zustand";

// Import all services from the Lib folder
import { AgeRestrictionService } from "../lib/AgeRestrictionService";
import { CheckService } from "../lib/Check";
import { CheckTicketService } from "../lib/CheckTicket";
import { CinemaService } from "../lib/Cinema";
import { ClientService } from "../lib/Client";
import { CityService } from "../lib/City";
import { CountryService } from "../lib/Country";
import { DeliveryOrderService } from "../lib/DeliveryOrder";
import { DeliveryOrderStatusService } from "../lib/DeliveryOrderStatus";
import { EmployeeService } from "../lib/Employee";
import { EmployeePositionService } from "../lib/EmployeePosition";
import { GenericService } from "../lib/GenericService";
import { GenreService } from "../lib/Genre";
import { HallService } from "../lib/Hall";
import { HallTechnologyService } from "../lib/HallTechnology";
import { LanguageService } from "../lib/Language";
import { MovieService } from "../lib/Movie";
// import { MoviePosterService } from "../Lib/MoviePoster";
import { MoviesGenreService } from "../lib/MoviesGenre";
import { PaymentMethodService } from "../lib/PaymentMethod";
import { ProductService } from "../lib/Product";
import { ProductCheckService } from "../lib/ProductCheck";
import { ProductCheckDetailService } from "../lib/ProductCheckDetail";
import { ProductPlacementService } from "../lib/ProductPlacement";
import { ProductsInOrderService } from "../lib/ProductsInOrder";
import { ProductsInStorageService } from "../lib/ProductsInStorage";
import { ProductTypeService } from "../lib/ProductType";
import { PublisherService } from "../lib/Publisher";
import { RunService } from "../lib/Run";
import { ScreeningService } from "../lib/Screening";
import { ScreeningFormatService } from "../lib/ScreeningFormat";
import { SeatService } from "../lib/Seat";
import { SupplierService } from "../lib/Supplier";
import { TicketService } from "../lib/Ticket";
import { LoginService } from "../lib/LoginService";
import { ScreeningPriceService } from "@/lib/ScreeningPrice";
import { SeatCategoryService } from "@/lib/SeatCategory";
import { UserActionService } from "@/lib/UserAction";

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
  loginService: LoginService;
  screeningPriceService: ScreeningPriceService;
  seatCategoryService: SeatCategoryService;
  userActionService: UserActionService;
};

export const useServiceStore = create<ServiceStore>(() => ({
  ageRestrictionService: new AgeRestrictionService(`${baseUrl}/ageRestriction`),
  checkService: new CheckService(`${baseUrl}/check`),
  checkTicketService: new CheckTicketService(`${baseUrl}/checkTicket`),
  cinemaService: new CinemaService(`${baseUrl}/cinema`),
  clientService: new ClientService(`${baseUrl}/client`),
  cityService: new CityService(`${baseUrl}/city`),
  countryService: new CountryService(`${baseUrl}/country`),
  deliveryOrderService: new DeliveryOrderService(`${baseUrl}/DeliveryOrder`),
  deliveryOrderStatusService: new DeliveryOrderStatusService(
    `${baseUrl}/DeliveryOrderStatus`
  ),
  employeeService: new EmployeeService(`${baseUrl}/employee`),
  employeePositionService: new EmployeePositionService(
    `${baseUrl}/employeePosition`
  ),
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
  productCheckDetailService: new ProductCheckDetailService(
    `${baseUrl}/productCheckDetail`
  ),
  productPlacementService: new ProductPlacementService(
    `${baseUrl}/productPlacement`
  ),
  productsInOrderService: new ProductsInOrderService(
    `${baseUrl}/productInOrder`
  ),
  productsInStorageService: new ProductsInStorageService(
    `${baseUrl}/productInStorage`
  ),
  productTypeService: new ProductTypeService(`${baseUrl}/productType`),
  publisherService: new PublisherService(`${baseUrl}/publisher`),
  runService: new RunService(`${baseUrl}/run`),
  screeningService: new ScreeningService(`${baseUrl}/screening`),
  screeningFormatService: new ScreeningFormatService(
    `${baseUrl}/screeningFormat`
  ),
  seatService: new SeatService(`${baseUrl}/seat`),
  supplierService: new SupplierService(`${baseUrl}/supplier`),
  ticketService: new TicketService(`${baseUrl}/ticket`),
  loginService: new LoginService(`${baseUrl}/login`),
  screeningPriceService: new ScreeningPriceService(`${baseUrl}/screeningPrice`),

  seatCategoryService: new SeatCategoryService(`${baseUrl}/seatCategory`),

  userActionService: new UserActionService(),
}));
