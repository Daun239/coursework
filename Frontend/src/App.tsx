import './App.css';
import React, { useEffect } from 'react';
import { useUserStore } from '../Stores/UserStore';
import { jwtDecode } from 'jwt-decode';

import Navbar from "../Components/Navbar";

import LoginPage from "../Features/Login/LoginPage";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import ScreeningTickets from "../Features/Screenings/Components/ScreeningTickets";
import DecodedToken from "../Types/DecodedToken";
import { User } from '../Types/User';
import MovieList from '../Components/MovieList';
import Profile from '../Components/Profile';
import ProductsList from "../Features/Products/Components/ProductsList";
import MovieFullDetail from "../Components/MovieFullDetail";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    <div>
      {/* Only show Navbar if user is logged in */}
      {user && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/screeningTickets/:id" element={<ScreeningTickets />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieFullDetail />} />
        <Route path="/productsList" element={<ProductsList />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
