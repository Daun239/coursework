import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { User } from "../Types/User";
import { useServiceStore } from "./ServicesStore";
import { Cinema } from "../Types/Cinema";
import { UserActionLog } from "@/Types/UserActionLog";
import { UserActionService } from "@/lib/UserAction";

type UserStore = {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logOut: (userActionService?: UserActionService) => void;
};

const getUserFromToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);

    // Debug: Log the decoded token payload
    console.log("Decoded token payload:", decoded);

    // Check specifically for employeePosition
    console.log("employeePosition from token:", decoded.employeePosition);

    return {
      employeeId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      surname: decoded.surname,
      cellNumber: decoded.cellNumber,
      cinemaId: decoded.cinemaId,
      employeePosition: decoded.employeePosition || "", // Provide a default empty string if null
      CinemaName: decoded.cinemaName,
      CityName: decoded.cityName,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// This will run when the module is loaded
const tokenFromStorage = localStorage.getItem("jwt");
let userFromToken = null;

if (tokenFromStorage) {
  console.log("Token found in localStorage");
  userFromToken = getUserFromToken(tokenFromStorage);
  console.log("User extracted from token:", userFromToken);
} else {
  console.log("No token found in localStorage");
}

export const useUserStore = create<UserStore>((set) => ({
  user: userFromToken,
  token: tokenFromStorage,
  setUser: (user, token) => {
    console.log("Setting user:", user);
    localStorage.setItem("jwt", token);
    set({ user, token });
  },
  logOut: (userActionService?: UserActionService) => {
    const user = useUserStore.getState().user;

    const actionLog: UserActionLog = {
      action: "Logged out",
      details: `${JSON.stringify(user)}`,
      entity: "User",
      timestamp: new Date(),
      user: `${user?.name ?? ""} ${user?.surname ?? ""}`,
    };

    if (userActionService) {
      userActionService.post(actionLog);
    }

    localStorage.removeItem("jwt");
    set({ user: null, token: null });
  },
}));
