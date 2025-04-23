import { jwtDecode } from "jwt-decode";

import { useUserStore } from "../Stores/UserStore";

type JwtPayload = {
  sub: string; // employeeId
  email: string;
  name: string;
  surname: string;
  cellNumber: string;
  role: string;
  cinemaId: string;
  exp: number;
  iat: number;
};

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

        console.log("decoded", decoded);
        const user = {
          employeeId: Number(decoded.sub),
          email: decoded.email,
          name: decoded.name,
          surname: decoded.surname,
          cellNumber: decoded.cellNumber,
          role: decoded.role,
          cinemaId: Number(decoded.cinemaId),
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
