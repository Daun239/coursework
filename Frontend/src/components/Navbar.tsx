import { Link } from 'react-router-dom';
import { useUserStore } from '../Stores/UserStore';
import CartLogoOnNavbar from "../Features/Cart/Components/CartLogoOnNavbar";
import ThemeToggle from './ThemeToggle';
import Profile from './Profile';

const Navbar = () => {
  const { user } = useUserStore();

  return (
    <div className="navbar bg-white dark:bg-gray-950 shadow-md w-full fixed top-0 left-0 z-10">
      {/* Left side - App title */}
      <div className="flex items-center gap-4">
        <p className=" text-lg font-semibold">
          {user?.CinemaName}
        </p>
        <Link to="/movies" className="btn btn-ghost text-xl  hover:bg-gray-700">
          🎟 Movies
        </Link>
        <Link to="/products/" className="btn btn-ghost text-xl  hover:bg-gray-700">
          Products
        </Link>

        <Link to="/deliveryOrders" className="btn btn-ghost text-xl  hover:bg-gray-700">
          DeliveryOrders
        </Link>

      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-auto">
        <CartLogoOnNavbar />

        {/* Theme toggle */}
        <ThemeToggle />

        <p className="text-sm">EN</p>

        {/* Profile dropdown */}
        {user && (
          <Profile
            CinemaId={user.cinemaId}
            CellNumber={user.cellNumber}
            Email={user.email}
            EmployeePosition={user.role}
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
