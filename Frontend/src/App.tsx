import './App.css';
import React, { useEffect } from 'react';
import { useUserStore } from '../Stores/UserStore';
import { jwtDecode } from 'jwt-decode';

import Navbar from "../Components/Navbar"

import LoginPage from "../Features/Login/LoginPage";

import { Route, Routes } from "react-router-dom";

import ScreeningTickets from "../Features/Screenings/Components/ScreeningTickets"

import DecodedToken from "../Types/DecodedToken"

import { User } from '../Types/User';
import MovieList from '../Components/MovieList';
import Profile from '../Components/Profile';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import ProductsList from "../Features/Products/Components/ProductsList"

import MovieFullDetail from "../Components/MovieFullDetail"



// Decoding the JWT and extracting user data
const getDecodedToken = (token: string | null) => {
  if (token) {
    try {
      return jwtDecode<DecodedToken>(token); // Decode JWT and return payload
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
  return null;
};

function App() {
  const { user, token, setUser } = useUserStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken && !token) {
      const decodedToken = getDecodedToken(storedToken);

      console.log(decodedToken);
      if (decodedToken) {
        const userData: User = {
          employeeId: decodedToken.employeeId,
          cinemaId: String(decodedToken.cinemaId),
          name: decodedToken.name,
          surname: decodedToken.surname,
          cellNumber: decodedToken.cellNumber,
          email: decodedToken.email,
          employeePosition: decodedToken.role,  // Adjust this too
        };
        setUser(userData, storedToken);
      }
    }
  }, [token, setUser]);

  return (
    <div>


      <Navbar />
      <Routes>
        <Route path="/screeningTickets/:id" element={<ScreeningTickets />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies" element={< MovieList />} />
        <Route path="/movies/:id" element={<MovieFullDetail />} />

        <Route path="/productsList" element={<ProductsList />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
