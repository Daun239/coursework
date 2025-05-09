import { Link } from 'react-router-dom';
import { useUserStore } from '../Stores/UserStore';
import CartLogoOnNavbar from "../Features/Cart/Components/CartLogoOnNavbar";
import ThemeToggle from './ThemeToggle';
import Profile from './Profile';
import { useLanguageStore } from '@/Stores/useLanguageStore';

const Navbar = () => {
  const { user } = useUserStore();
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="navbar bg-white dark:bg-gray-950 shadow-md w-full fixed top-0 left-0 z-10">
      {/* Left side - App title and navigation links */}
      <div className="flex items-center gap-4">
        <p className="text-lg font-semibold">
          {user?.CinemaName}
        </p>

        {/* Cashier-only links */}
        {user?.employeePosition === 'Cashier' && (
          <>
            <Link to="/movies" className="btn btn-ghost text-xl hover:bg-gray-700">
              🎟 {language === 'en' ? 'Movies' : 'Фільми'}
            </Link>
            <Link to="/products" className="btn btn-ghost text-xl hover:bg-gray-700">
              {language === 'en' ? 'Products' : 'Продукти'}
            </Link>
          </>
        )}

        {/* Manager and WarehouseWorker */}
        {(user?.employeePosition === 'Manager' || user?.employeePosition === 'WarehouseWorker') && (
          <Link to="/deliveryOrders" className="btn btn-ghost text-xl hover:bg-gray-700">
            {language === 'en' ? 'Delivery Orders' : 'Замовлення доставки'}
          </Link>
        )}
      </div>

      {/* Right side - Cart, theme, language, profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Cart - Cashier only */}
        {user?.employeePosition === 'Cashier' && <CartLogoOnNavbar />}

        <ThemeToggle />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setLanguage('en')}
            className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-ghost'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ua')}
            className={`btn btn-sm ${language === 'ua' ? 'btn-primary' : 'btn-ghost'}`}
          >
            UA
          </button>
        </div>

        {/* Profile dropdown */}
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
      </div>
    </div>
  );
};

export default Navbar;
