import './App.css';
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import Navbar from "./components/Navbar";

import LoginPage from "./Features/Login/LoginPage";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import MovieList from './Features/Movie/Components/MovieList';
import { useUserStore } from './Stores/UserStore';
import DecodedToken from './Types/DecodedToken';
import { User } from './Types/User';
import { Toaster } from 'sonner';
import ProductsList from './Features/Products/Components/ProductsList';
import DeliveryOrder from './Features/DeliveryOrder/Components/DeliveryOrder';
import ProtectedRoute from './components/ProtectedRoute';
import AuditComponent from './Features/Audit/Components/AuditComponent';
import CinemasPage from './Features/Management/Components/CinemasPage';
import ClientsPage from './Features/Clients/Components/ClientsPage';
import SuppliersPage from './Features/Suppliers/Components/SuppliersPage';
import EmployeesPage from './Features/Employees/Components/EmployeesPage';

// main.tsx or App.tsx
import './i18n'; // 👈 Import this before any component that uses translations
import { LanguageSync } from './LanguageSync';




const getDecodedToken = (token: string | null) => {
  if (token) {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
  return null;
};

function App() {
  const { user, token, setUser } = useUserStore();
  const location = useLocation();

  // console.log('user', user);

  useEffect(() => {
    console.log("user store:", useUserStore.getState());
  }, []);



  const { setTheme, theme } = useTheme(); // Access setTheme and current theme from context

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Handle 't' key in both English and Ukrainian keyboard layouts
      const ukrainianTKey = e.key === "е" || e.key === "t"; // 'е' is the Ukrainian equivalent of 't'

      if (ukrainianTKey && (e.metaKey || e.ctrlKey) && e.altKey) {
        e.preventDefault();
        console.log('THEME SWITCH');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      }
    };

    document.addEventListener("keydown", down);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [theme, setTheme]);


  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken && !token) {
      const decodedToken = getDecodedToken(storedToken);
      if (decodedToken) {
        const userData: User = {
          employeeId: decodedToken.employeeId,
          cinemaId: String(decodedToken.cinemaId),
          name: decodedToken.name,
          surname: decodedToken.surname,
          cellNumber: decodedToken.cellNumber,
          email: decodedToken.email,
          employeePosition: decodedToken.role,
        };
        setUser(userData, storedToken);
      }
    }
  }, [token, setUser]);

  // Redirect logic: if no user and not on /login -> redirect to login
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (


    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      {/* Only show Navbar if user is logged in */}
      {user && <Navbar />}

      <div className="w-full bg-white dark:bg-gray-800 m-0 p-0">

        <LanguageSync />


        {/* <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/movies" element={<MovieList />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/deliveryOrders" element={<DeliveryOrder />} />

          <Route path="/auditPage" element={<AuditComponent />} />

          <Route path="/cinemasPage" element={<CinemasPage />} />

          <Route path="/clientsPage" element={<ClientsPage />} />

          <Route path="/suppliersPage" element={<SuppliersPage />} />

          <Route path="/employeesPage" element={<EmployeesPage />} />


        </Routes> */}


        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/movies"
            element={
              <ProtectedRoute
                element={<MovieList />}
                allowedRoles={['Cashier']}
              />
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute
                element={<ProductsList />}
                allowedRoles={['Cashier', 'Manager']}
              />
            }
          />

          <Route
            path="/deliveryOrders"
            element={
              <ProtectedRoute
                element={<DeliveryOrder />}
                allowedRoles={['Manager', 'WarehouseWorker']}
              />
            }
          />

          <Route
            path="/clientsPage"
            element={
              <ProtectedRoute
                element={<ClientsPage />}
                allowedRoles={['Manager']}
              />
            }
          />

          <Route
            path="/suppliersPage"
            element={
              <ProtectedRoute
                element={<SuppliersPage />}
                allowedRoles={['Manager']}
              />
            }
          />

          <Route
            path="/employeesPage"
            element={
              <ProtectedRoute
                element={<EmployeesPage />}
                allowedRoles={['Manager']}
              />
            }
          />

          <Route
            path="/cinemasPage"
            element={
              <ProtectedRoute
                element={<CinemasPage />}
                allowedRoles={['Manager']}
              />
            }
          />

          <Route
            path="/auditPage"
            element={
              <ProtectedRoute
                element={<AuditComponent />}
                allowedRoles={['Admin']}
              />
            }
          />
        </Routes>

        {/* <Routes>
          <Route
            path="/movies"
            element={
              <ProtectedRoute
                element={<MovieList />}
                allowedRoles={["Cashier"]}
              />
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute
                element={<ProductsList />}
                allowedRoles={["Cashier"]}
              />
            }
          />

          <Route
            path="/deliveryOrders"
            element={
              <ProtectedRoute
                element={<DeliveryOrder />}
                allowedRoles={["Manager", "WarehouseWorker"]}
              />
            }
          />
        </Routes> */}


      </div>

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <Toaster />
    </ ThemeProvider >
  );
}

export default App;
