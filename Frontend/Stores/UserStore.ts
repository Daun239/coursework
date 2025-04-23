import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { User } from "../Types/User";

type UserStore = {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logOut: () => void;
};

const getUserFromToken = (token: string): User | null => {
  try {
    const decoded: any = jwtDecode(token);
    return {
      employeeId: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      surname: decoded.surname,
      cellNumber: decoded.cellNumber,
      cinemaId: decoded.cinemaId,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};

const tokenFromStorage = localStorage.getItem("jwt");
const userFromToken = tokenFromStorage
  ? getUserFromToken(tokenFromStorage)
  : null;

export const useUserStore = create<UserStore>((set) => ({
  user: userFromToken,
  token: tokenFromStorage,
  setUser: (user, token) => {
    localStorage.setItem("jwt", token);
    set({ user, token });
  },
  logOut: () => {
    localStorage.removeItem("jwt");
    set({ user: null, token: null });
  },
}));
