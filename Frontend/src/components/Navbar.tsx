import { Link } from 'react-router-dom';
import { useUserStore } from '../Stores/UserStore';
import CartLogoOnNavbar from "../Features/Cart/Components/CartLogoOnNavbar";
import ThemeToggle from './ThemeToggle';
import Profile from './Profile';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';

const Navbar = () => {
  const { user } = useUserStore();
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="navbar bg-white dark:bg-gray-950 shadow-md w-full fixed top-0 left-0 z-10 px-4 py-2 flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold dark:text-white">
          {user?.CinemaName}
        </p>

        {user?.employeePosition === 'Cashier' && (
          <>
            <Link to="/movies" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
              🎟 {language === 'en' ? 'Movies' : 'Фільми'}
            </Link>
            <Link to="/products" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
              {language === 'en' ? 'Products' : 'Продукти'}
            </Link>
          </>
        )}

        {(user?.employeePosition === 'Manager' || user?.employeePosition === 'WarehouseWorker') && (
          <Link to="/deliveryOrders" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
            {language === 'en' ? 'Delivery Orders' : 'Замовлення доставки'}
          </Link>
        )}




        <Link to="/clientsPage" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
          {language === 'en' ? 'Clients' : 'Клієнти'}
        </Link>

        <Link to="/suppliersPage" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
          {language === 'en' ? 'Suppliers' : 'Постачальники'}
        </Link>

        <Link to="/employeesPage" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
          {language === 'en' ? 'Employees' : 'Працівники'}
        </Link>

        <Link to="/cinemasPage" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
          {language === 'en' ? 'Cinemas' : 'Кінотеатри'}
        </Link>

        <Link to="/auditPage" className="btn btn-ghost text-md hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white">
          {language === 'en' ? 'Monitoring' : 'Моніторинг'}
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user?.employeePosition === 'Cashier' && <CartLogoOnNavbar />}
        <ThemeToggle />

        {/* Language toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLanguage('en')}
            className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'} dark:text-white`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ua')}
            className={`btn btn-sm ${language === 'ua' ? 'btn-primary' : 'btn-ghost'} dark:text-white`}
          >
            UA
          </button>
        </div>

        {/* Profile */}
        {user && (
          <Profile
            CinemaId={user.cinemaId}
            CellNumber={user.cellNumber}
            Email={user.email}
            EmployeePosition={user.employeePosition}
            Name={user.name}
            Surname={user.surname}
            EmployeeId={user.employeeId}
          />
        )}

        {/* Help Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-6 h-6 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0
                     1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442
                     -.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0
                     9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="rounded-lg shadow-xl p-3 max-w-sm bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 whitespace-normal"
          >
            <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {language === 'en' ? 'Keyboard shortcuts' : 'Гарячі клавіші'}
            </DropdownMenuLabel>
            <DropdownMenuItem className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-2 py-1 cursor-default">
              ⌨ {language === 'en'
                ? 'To open filters, press Ctrl + Alt + F. To open the cart, press Ctrl + Alt + C'
                : 'Щоб відкрити фільтри, натисніть Ctrl + Alt + F. Щоб відкрити кошик — Ctrl + Alt + C'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
