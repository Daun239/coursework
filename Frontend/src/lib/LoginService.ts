import { jwtDecode, JwtPayload } from "jwt-decode";
import { useUserStore } from "../Stores/UserStore";
import { useServiceStore } from "../Stores/ServicesStore"; // <== you will also need services

export class LoginService {
  constructor(private baseUrl: string) {}

  async loginUser(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;
        const decoded: JwtPayload = jwtDecode(token);

        const { cityService, cinemaService } = useServiceStore.getState(); // <== get cinema service

        let cityName = "";
        let cinemaName = "";
        try {
          const [cinema] = await cinemaService.getAll(
            `CinemaId = ${decoded.cinemaId}`
          );

          const [city] = await cityService.getAll(`CityId = ${cinema.cityId}`);

          cinemaName = cinema.name; // assuming API returns { name: ... }
          cityName = city.city1;
        } catch (fetchCinemaError) {
          console.error("Failed to fetch cinema name:", fetchCinemaError);
        }

        const user = {
          employeeId: Number(decoded.sub),
          email: decoded.email,
          name: decoded.name,
          surname: decoded.surname,
          cellNumber: decoded.cellNumber,
          cinemaId: Number(decoded.cinemaId),
          role: decoded.role,
          CinemaName: cinemaName, // Now filled
          CityName: cityName,
        };

        console.log("user", user);
        console.log("token", token);

        useUserStore.getState().setUser(user, token);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  }
}
