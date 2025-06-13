import { jwtDecode, JwtPayload } from "jwt-decode";
import { useUserStore } from "../Stores/UserStore";
import { useServiceStore } from "../Stores/ServicesStore";

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
        const decoded: any = jwtDecode(token);

        const { cityService, cinemaService } = useServiceStore.getState();

        let cityName = "";
        let cinemaName = "";
        
        try {
          const [cinema] = await cinemaService.getAll(
            `CinemaId = ${decoded.cinemaId}`
          );

          const [city] = await cityService.getAll(`CityId = ${cinema.cityId}`);

          cinemaName = cinema.name;
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
          employeePosition: decoded.employeePosition || "", 
          role: decoded.role,
          CinemaName: cinemaName,
          CityName: cityName,
        };

        console.log("User created from login:", user);
        console.log("Token:", token);

        // Set user in store with the token
        useUserStore.getState().setUser(user, token);

        return { success: true, user, token };
      } else {
        console.error("Login failed:", data.message);
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login." };
    }
  }
}