import './App.css';
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import Navbar from "./components/Navbar";

import LoginPage from "./Features/Login/LoginPage";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from './components/ThemeProvider';
import MovieList from './Features/Movie/Components/MovieList';
import { useUserStore } from './Stores/UserStore';
import DecodedToken from './Types/DecodedToken';
import { User } from './Types/User';
import { Toaster } from 'sonner';
import ProductsList from './Features/Products/Components/ProductsList';


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


  useEffect(() => {
    console.log('MovieList component rendered');
  }, []);



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

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/movies" element={<MovieList />} />
        <Route path="/products" element={<ProductsList />} />
      </Routes>

      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <Toaster />
    </ ThemeProvider>
  );
}

export default App;
