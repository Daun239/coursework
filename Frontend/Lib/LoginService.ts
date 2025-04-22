// Lib/LoginService.ts
import { useUserStore } from "../Stores/UserStore";

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
        const apiUser = data.employee || data.user; // ← залежно як назвав у API (в тебе в API це `employee`)
        const user = {
          ...apiUser,
          employeeId: apiUser.id, // 👈 додаємо employeeId вручну
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
